// const User=require("../models/User")

const { validateToken } = require("../services/jwtAuth");

const checkForAuthCookies=(cookieName)=>{
    return(req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName]
        if(!tokenCookieValue){
            return next();
        }
        try{
            const userPayload=validateToken(tokenCookieValue)
            req.user=userPayload;
            return next();
        }catch(error){
            return next()
        }

    }

}

module.exports={checkForAuthCookies};