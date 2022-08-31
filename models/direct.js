const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const DirectSchema=new Schema({
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    delete_confirm_user1:{
        type:String,
        required:true
    },
    delete_confirm_user2:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Direct=mongoose.model("Direct",DirectSchema);
module.exports=Direct;