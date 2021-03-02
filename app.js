const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {Mongoose_URI} = require("./config/keys");

require('./model/user');
require('./model/post');
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user')); 
mongoose.connect(Mongoose_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('connected',() => {
    console.log("successfully connected to Mongo DB server Database.");
} );

mongoose.connection.on('error',(err) => {
    console.log("error occured!!", err);
} );
const PORT = process.env.PORT || '5000';

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

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
