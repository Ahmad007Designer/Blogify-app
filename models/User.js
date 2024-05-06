const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const {generateToken}=require("../services/jwtAuth")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,  
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:'/images/avatar.jpg'
    },
    roleType:{
            type:String,
            enum:['user','admin'],
            default:'user',
            lowercase: true,
        }

},{timeseries:true});

userSchema.pre('save',async function(next){
    const person=this;
    //hash the password only when password is modified or new created
    if(!person.isModified('password')) return next();

    try{
        //generate hash passsword ---> [hash  + salt]
        //this is generate salt using some text
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(person.password,salt)
        person.password=hashPassword;
        next()
    }catch(err){
        return next(err)
    }
})

userSchema.methods.comparePasswordGenToken = async function(candidatePassword) {
    const user=this;
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        if(!isMatch){
            throw new Error("Incorrect Password")
        }

        const token = generateToken(user)
        return token;
        
    } catch (err) {
        throw err;
    }
};



const User=mongoose.model("User",userSchema);
module.exports=User;