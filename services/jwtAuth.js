const jwt = require("jsonwebtoken");
const secret=process.env.JWT_SECRET


//generate the function of JWT token
const generateToken = (user) => {
    const payload={
        name:user.name,
        id:user.id,
        password:user.password,
        email:user.email,
        roleType:user.roleType
    }
    const token= jwt.sign(payload,secret)
    return token
}

const  validateToken = (token) => {
    const payload=jwt.verify(token,secret)
    return payload
}


module.exports = {
   generateToken,
   validateToken,
};