const mongoose = require("mongoose");
const Chat = require("./models/chat.js");


main().then(() =>{console.log("connected");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chattty');
}

let allChats= [
    {
        to: "java",
        from: "C",
        msg: "You are definitely better than me",
        created_at: new Date(),
    },
    {
        to: "Richa",
        from: "Vinit",
        msg: "Papa ko call krdo",
        created_at: new Date()
    },
    {
        to: "Twitter",
        from: "Nidhi",
        msg: "Please give me free subscription :cry",
        created_at: new Date()
    }
];

Chat.insertMany(allChats);

// allChats.save()
// .then((res) =>{ console.log(res);
// }).catch((e) =>{console.log(e);
// });