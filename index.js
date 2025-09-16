const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Chat = require("./models/chat.js");
const { log } = require("console");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

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
    try {
        let chats = await Chat.find();
    //console.log(chats);
    res.render("index.ejs", {chats});
    } catch (error) {
        next(error);
    }
})

app.get("/chats/new", (req,res) =>{
    //throw new ExpressError(444, "page not found");
    res.render("new.ejs");
})

app.post("/chats", async(req,res,next) =>{
    try {
        let { to, from, msg } = req.body;
    let newChat = new Chat({
        to: to,
        from: from,
        msg: msg,
        created_at: new Date()
    }) 
    await newChat.save();
    console.log("message saved");
    res.redirect("/chats");
    } catch (error) {
        next(error);//calls default error handling middleware.
    }
})

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err));
    };
}

app.get("/chats/:id", asyncWrap(async(req,res,next)=>{
        let { id } = req.params;
    let chat = await Chat.findById(id);
    if(!chat){
        return next(new ExpressError(403, "id not found"));
    }
    res.render("edit.ejs", { chat });
}));



app.get("/chats/:id/edit", async(req,res) =>{
    try {
        let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
    } catch (error) {
        next(error);
    }
})



app.put("/chats/:id", async(req,res)=>{
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    let updated_at = new Date();
    let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, {runValidators:true, new: true});

    Chat.findByIdAndUpdate(id,  {created_at: updated_at}, {new: true});

    res.redirect("/chats");
});

app.delete("/chats/:id", async(req,res) =>{
    try {
        let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
    } catch (error) {
       next(error); 
    }
})

// app.use((err,req,res,next) =>{
//     console.log(err.name);
//     next(err);    
// })

app.use((err,req,res,next) =>{
    let { status=500, message= "some error occured"} = err;
    res.status(status).send(message);
})

app.listen(8080 , () =>{
    console.log("listening on port 8080");
})



