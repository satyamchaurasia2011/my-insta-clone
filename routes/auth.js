const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
// const requireLogin = require("../requireLogin/requireLogin")


router.post("/signup", (req, res) => {
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password){
        return res.status(422).json({error : "please fill all fields"});
    }
    User.findOne({email : email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error : "user already exists!!"});
        }
        bcrypt.hash(password, 13)
        .then(hashedPassword => {
            const user = new User({
                name,
                email,
                password : hashedPassword,
                pic
            });
            user.save()
            .then(user => {
                res.json({message : "saved successfully..."})
            })
            .catch(err => {
                console.log(err);
            })
        })
        })
       
    .catch(err => {
        console.log(err);
    })
});

router.post("/signin", (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error : "please add details!"});
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error : "Invalid Email or password!"});
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                // res.json({message : "Successfully signed in..."});
                const token = jwt.sign({_id : savedUser._id}, JWT_SECRET);
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token : token, user : {_id,name,email,followers,following,pic}});
            } else {
                return res.status(422).json({error : "Invalid Email or password!"});
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
})

module.exports = router