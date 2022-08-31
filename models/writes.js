const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const WriteSchema=new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    username:{
        type:String,
        required:true
    },
    getwrite:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Write=mongoose.model("Write",WriteSchema);
module.exports=Write;