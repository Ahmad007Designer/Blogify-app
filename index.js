const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./db");
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { checkForAuthCookies } = require("./middlewares/auth");
const PORT = process.env.PORT || 5000;
const Blog=require("./models/Blog")
const multer = require('multer');


app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

// Middleware for parsing cookies and session
app.use(express.static(path.resolve("./public")))

app.use(cookieParser());
app.use(checkForAuthCookies('token'));




// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/",async(req, res) => {
    const blog=await Blog.find({});
   return res.render("home", {
       user: req.user,
       msg: "",
       blog,
   });
});

const useRouter = require("./routes/userRoutes");
app.use("/user", useRouter);

const blogRouter = require("./routes/blogRoutes");
app.use("/blog", blogRouter);






app.listen(PORT, () => console.log("Server is running.."));
