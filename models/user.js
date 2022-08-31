const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    user_image:{
        type:String
    },
    reset_token:{
        type:String
    },
    reset_token_expiration:{
        type:Date
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const User=mongoose.model("User",UserSchema);
module.exports=User;