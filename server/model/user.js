const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String, 
        required : true
    },
    password : {
        type : String,
        
    },
    resetToken : String,
    expiresToken : Date,
    pic : {
        type : String,
        default : 'https://res.cloudinary.com/dvbkfxikz/image/upload/v1614623695/pngkit_burn-mark-png_1262807_afmm3z.png'
    },
    followers : [{type : ObjectId, ref : "User"}],
    following : [{type : ObjectId, ref : "User"}]
});

mongoose.model("User", userSchema);