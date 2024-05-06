const mongoose=require("mongoose")
require('dotenv').config();
const mongoURL=process.env.MONGO_URL

// for mongodb atlas
// mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

//for mongodb compass
mongoose.connect(mongoURL)
const db=mongoose.connection;

db.on('connected',()=>{
    console.log("MongoDb is connected!")
})

db.on('disconnected',()=>{
    console.log("MongoDb is disconnected!")
})

db.on('error',(err)=>{
    console.error("MongoDb is connection Error!",err.message)
})

module.exports=db;

