const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {Mongoose_URI} = require("./config/keys");
const server = require('http').createServer(app);
const cors = require("cors");
const io = require("socket.io")(8900, {
    cors : {
        origin : "http://localhost:3000",
    },
});
require('./model/user');
require('./model/post');
require("./model/Conversation");
require("./model/Message");
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user')); 
app.use(require("./routes/conversations"));
app.use(require("./routes/messages"));
mongoose.connect(Mongoose_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('connected',() => {
    console.log("successfully connected to Mongo DB server Database.");
} );

mongoose.connection.on('error',(err) => {
    console.log("error occured!!", err);
} );
const PORT = process.env.PORT || '5000';

//socket
let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
       users.push({userId, socketId});
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on('connection', (socket) => {
    //when connect
    console.log("a user connected");
    //take userId and socketId from user
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });
     //when disconnect
     socket.on('disconnect', () => {
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})

app.listen(PORT, () => {
    console.log("Server started on port 5000");
})














// const customMiddleware = (req, res, next) => {
//     console.log("middleware executed!");
//     next();
// }

// app.get("/", (req, res) => {
//     console.log("appget");
//     res.send("Hello World!!");
// });
// app.get("/about", customMiddleware , (req, res) => { //middleware only executed for this route.
//     res.send("About page!!");
// })
