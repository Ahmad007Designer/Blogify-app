const mongoose=require("mongoose")
const Schema = mongoose.Schema;
const User = require("./User");

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,  
    },
    coverImage:{
        type:String,
        default:false,
    },
    createdBy:{
            type: Schema.Types.ObjectId,
            ref:'User',
    },

},{timestamps:true});


const Blog=mongoose.model("Blog",blogSchema);
module.exports=Blog;