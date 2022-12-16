const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Conversation = mongoose.model("Conversation");

//Select a user for chat making a room of two
router.post("/conversation", requireLogin,  (req, res) => {
  Conversation.find({
    members: [req.body.senderId, req.body.receiverId],
  }).then((user) => {
    if(!user.length){
      Conversation.find({
        members: [req.body.receiverId, req.body.senderId],
      }).then(async (user) => {
        if(!user.length){
          const newConverstion = new Conversation({
            members: [req.body.senderId, req.body.receiverId],
          });
          try {
            const savedConversation = await newConverstion.save();
            res.status(200).json(savedConversation);
          } catch (err) {
            res.status(500).json(err);
          }
        }
      })
       
    }
  }).catch(err => console.log(err))
 
});

router.get("/conversation/:userId", requireLogin, (req, res) => {
  //console.log(req.params.userId);
   Conversation.find({
    members: { $in: [req.params.userId] },
  })
    .then((conversation) => {
      res.status(200).json(conversation);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
