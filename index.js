const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Chat = require("./models/chat.js");
const { log } = require("console");
const methodOverride = require("method-override");

app.use(express.urlencoded({extended: true}));

app.set("views", path.join(__dirname ,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine" , "ejs")
app.use(methodOverride("_method"));

main().then(() =>{console.log("connected");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chattty');
}

app.get("/", (req,res)=>{
    res.send("working");
})

app.get("/chats", async (req,res)=>{
    let chats = await Chat.find();
    //console.log(chats);
    res.render("index.ejs", {chats});
})

app.get("/chats/new", (req,res) =>{
    res.render("new.ejs");
})

app.post("/chats", (req,res) =>{
    let { to, from, msg } = req.body;
    let newChat = new Chat({
        to: to,
        from: from,
        msg: msg,
        created_at: new Date()
    }) 
    newChat.save().then((res)=>{console.log(res);
    }).catch((e) =>{console.log(e);
    })
    console.log("message saved");
    res.redirect("/chats");
})

app.get("/chats/:id/edit", async(req,res) =>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
})

app.put("/chats/:id", (req,res)=>{
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    let updated_at = new Date();
    let updatedChat = Chat.findByIdAndUpdate(id, {msg: newMsg}, {runValidators:true, new: true})
    .then((res) =>{console.log(res);
    });

    Chat.findByIdAndUpdate(id,  {created_at: updated_at}, {new: true})
    .then((res) =>{console.log(res);
    });

    res.redirect("/chats");
})

app.delete("/chats/:id", async(req,res) =>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
})

app.listen(8080 , () =>{
    console.log("listening on port 8080");
})



