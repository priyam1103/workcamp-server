const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    googleId: {
      type:String  
    },
    username: {
        type:String
    },
    imageUrl: {
        type:String,
    },
    emailId: {
        type:String
    },
    camps: {
        type:Array
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;