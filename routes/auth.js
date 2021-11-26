const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const {JWT_SECRET,SENDGRID_API,EMAIL} = require("../config/keys");
// const requireLogin = require("../requireLogin/requireLogin")
//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
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client('803835066549-eukhrbnee2bhb3ff5apbgf5fbed1m8bj.apps.googleusercontent.com');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth : {
        api_key : SENDGRID_API
    }
}))

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
                transporter.sendMail({
                    to : user.email,
                    from : "satyamchaurasia2011@gmail.com",
                    subject : "signup success",
                    html : "<h1>Welcome to Instagram</h1><br><br><p>Hey,You are successfully create your account in my-insta-clone app.</p>"
                })
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
//google

router.post("/signupwithgoogle", async (req,res) => {
    const { tokenId } = req.body;
	await client
		.verifyIdToken({ idToken: tokenId, audience: '803835066549-eukhrbnee2bhb3ff5apbgf5fbed1m8bj.apps.googleusercontent.com' })
		.then((response) => {
           // console.log(response);
			const { email_verified, name, email, picture } = response.payload;
			if (email_verified) {
				User.findOne({ email }).exec(async (err, user) => {
					if (err) {
						return res.send(400).json({ error: "Something went wrong...." });
					} else {
						if (user) {
							console.log(user);
							const token = jwt.sign(
								{
									_id: user._id,
								},
								JWT_SECRET,
								{ expiresIn: "7d" }
							);
                                const {_id,name,email,followers,following,pic} = user;
                                res.json({token : token, user : {_id,name,email,followers,following,pic}});
						} else {
							let user = new User({
								name,
								email,
								pic : picture
							});
							console.log(user);
							try {
								await user.save();
                                transporter.sendMail({
                                    to : user.email,
                                    from : "satyamchaurasia2011@gmail.com",
                                    subject : "signup success",
                                    html : "<h1>Welcome to Instagram</h1><br><br><p>Hey,You are successfully create your account in my-insta-clone app.</p>"
                                })
								console.log(user._id);
                                const token = jwt.sign({_id : user._id}, JWT_SECRET);
                                const {_id,name,email,followers,following,pic} = user;
                                res.json({token : token, user : {_id,name,email,followers,following,pic}});
							} catch (error) {
								console.log(error);
								return res
									.status(400)
									.json({ error: "something went wrong..." });
							}
						}
					}
				});
			}
			// console.log(response.payload);
		});
})

router.post('/reset-password', (req,res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err);
        }
        const token = buffer.toString("hex")
        User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
              return  res.status(422).json({error : "User not exist with this email!"})
            }
            user.resetToken = token
            user.expiresToken = Date.now() + 600000
            user.save().then((result) => {
                transporter.sendMail({
                    to : user.email,
                    from : "satyamchaurasia2011@gmail.com",
                    subject : "password reset",
                    html : `
                    <p>You requested for password reset</p><br><br>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>`
                })
                res.json({message : "check your email..."})
            })
        })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken : sentToken, expiresToken : {$gt:Date.now()}})
    .then(user => {
        if(!user){
            return res.status(422).json({error : "Try again session expired!!"})
        }
        bcrypt.hash(newPassword, 12).then(hashedpassword => {
            user.password = hashedpassword
            user.resetToken = undefined
            user.expiresToken = undefined
            user.save().then(savedUser => {
                res.json({message : "password successfully changed"})
            })
        })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router