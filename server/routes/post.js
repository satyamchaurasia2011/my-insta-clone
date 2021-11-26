const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

router.get("/posts", requireLogin,  (req, res)=> {
    Post.find()
    .populate("postedBy", "_id name pic")  //this populate expands that id ...
    .populate("comments.postedBy", "_id name pic")
    .sort('-createdAt')
    .then(posts => {
        res.json({posts : posts})
    })
    .catch(err => {
        console.log(err);
    })
})
router.get("/subscribedpost", requireLogin,  (req, res)=> {
    //if postedBy in following...
    Post.find({postedBy : {$in:req.user.following}})
    .populate("postedBy", "_id name pic")  //this populate expands that id ...
    .populate("comments.postedBy", "_id name pic")
    .sort('-createdAt')
    .then(posts => {
        res.json({posts : posts})
    })
    .catch(err => {
        console.log(err);
    })
})
router.post("/createpost", requireLogin, (req, res) => {
    const {title, body, pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error : "please add all fields!!"});
    }
    // console.log(req.user);
    req.user.password = undefined;
    const post = new Post({
        title : title,
        body : body,
        photo : pic,
        postedBy : req.user
    });
    post.save()
    .then(result => {
        res.json({post : result})
    })
    .catch(err => {
        console.log(err);
    })
});

router.get("/mypost", requireLogin, (req, res) => {
    Post.find({postedBy : req.user._id})
    .populate("postedBy", "_id, name pic")
    .then(mypost => {
        res.json({mypost : mypost})
    })
    .catch(err => {
     console.log(err);
    })
})

router.put('/like', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {likes : req.user._id}
    },{
        new : true
    }).populate("postedBy", "_id name pic")  //this populate expands that id ...
    .populate("comments.postedBy", "_id name pic")
    .exec((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull : {likes : req.user._id}
    },{
        new : true
    }).populate("postedBy", "_id name pic")  //this populate expands that id ...
    .populate("comments.postedBy", "_id name pic")
    .exec((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req,res) => {
    const comment = {
        text : req.body.text,
        postedBy : req.user
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {comments : comment}
    },{
        new : true
    }).populate("postedBy", "_id name pic")  //this populate expands that id ...
    .populate("comments.postedBy", "_id name pic")
    
    .exec((err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId', requireLogin, (req,res) => {
    Post.findOne({_id:req.params.postId})
    .populate('postedBy', "_id pic")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
})

router.delete('/deletecomment/:postId', requireLogin, (req, res) => {
    const commentId = req.body.commentid
    Post.findOne({_id: req.params.postId })        
        .exec((err, post) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            post.comments.forEach((comment) => {
                if (comment._id.toString() === commentId.toString()) {
                    Post.findByIdAndUpdate(req.params.postId, {

                        $pull: { comments: comment }
                    }, { new: true })
                        .populate("postedBy", "_id name pic")
                        .populate("comments.postedBy", "_id name pic")
                        .exec((err, data) => {
                            if (err) {
                                return res.status(422).json({
                                    error: err
                                })
                            }
                            res.json(data)
                        })                        
                }
             })
        })
})
module.exports = router