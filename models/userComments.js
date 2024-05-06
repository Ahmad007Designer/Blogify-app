const mongoose=require("mongoose")
const Schema = mongoose.Schema;
const User = require("./User");
const Blog=require("./Blog")

const commentSchema=new mongoose.Schema
({
    content:{
        type:String,
        required:true,
    },
    blogId:{
            type:Schema.Types.ObjectId,
            ref:'Blog',
    },
    createdBy:{
            type: Schema.Types.ObjectId,
            ref:'User',
    },

},{timestamps:true});


const Comment=mongoose.model("Comment",commentSchema);
module.exports=Comment;