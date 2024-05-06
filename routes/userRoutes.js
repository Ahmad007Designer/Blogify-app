const expres = require("express")
const router = expres.Router();
const User = require("../models/User");
const cookieParser = require('cookie-parser');
const multer = require("multer")
const path = require("path")
const bcrypt =require("bcrypt")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/images/`));
    },
    filename: function (req, file, cb) {
        const filename = `${file.originalname}`;
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

// const {generateToken,jwtAuthMiddleware}=require("../jwtAuth")

//for Sing Up
router.get("/signup", async (req, res) => {
    return res.render("loginSignup", { msg: "",user:req.user })
})


router.post("/signup", upload.single('profileImage'), async (req, res) => {
    try {
        const { name, email, password, roleType } = req.body;
        const profileImage = req.file;
        if (!name || !email || !password || !roleType || !profileImage) {
            return res.render("loginSignup", { 
                msg: "All fields are required!",user:req.user 
            });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.render("loginSignup", { msg: "This email is already registered!",user:req.user });
        }

        const newUser = new User({
            name: name,
            email: email,
            password: password,
            roleType: roleType,
            profileImage: profileImage.filename
        });

        await newUser.save();

        return res.render("loginSignup", { msg: "You are registered successfully!",user:req.user });

    } catch (err) {
        return res.render("loginSignup", { msg: "Internal Server Error!" });
    }
});


//for Sign In
router.get("/signin", async (req, res) => {
    return res.render("loginSignup", { msg: "",user:req.user })
})

router.post("/signin", async (req, res) => {


    try {

        const { email, password } = req.body;
        const findUser = await User.findOne({ email: email });
        if (!email || !password) {
            return res.render("loginSignup", ({ msg: "All field Required!",user:req.user }))
        }
        if (!findUser) {
            return res.render("loginSignup", ({ msg: "User Not Found !",user:req.user }))
        }
        const token = await findUser.comparePasswordGenToken(password);

        return res.cookie("token", token).redirect("/")

    } catch (msg) {

        return res.render("loginSignup", {
            msg: "Incorrect Email or Password",
            user:req.user
        })
    }



})

//forgate 
router.get("/forgate", (req, res) => {
    return res.render("forgate", {
        user: req.user,
        msg: "",
        
    })
})

router.post("/forgate", async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const findUser = await User.findOne({ email: email })
        if (!findUser) {
            console.log("User Not Found Please go For Login!")
            return res.render("forgate", {
                user: req.user,
                msg: "User Not Found Please go For Login!"
            })
        }
        
        if ( password !== confirmPassword) {
            console.log("Confirm Password Not Match!")
            return res.render("forgate", {
                user: req.user,
                msg: "Confirm Password Not Match!"
            })
        }
  
        // const hashPassword= await bcrypt.hash(password,10)
        findUser.password=password;
        await findUser.save();

        return res.render("loginSignup", {
            user: req.user,
            msg: "Password Change Successfully!"
        })


    } catch (error) {
        console.log(error)
        return res.render("forgate", {
            user: req.user,
            msg: "An error occurred. Please try again later."
        })
    }


})



router.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/")
})



module.exports = router;