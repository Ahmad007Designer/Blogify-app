const expres = require("express")
const router = expres.Router();
const multer=require("multer")
const Blog = require("../models/Blog");
const path=require("path")
const Comment=require("../models/userComments")




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      
       const filename=`${Date.now()}-${file.originalname}`; 
      cb(null,filename)
    }
  })
  
const upload = multer({ storage: storage })


//for blog



router.post("/addUser",upload.single("coverImage") ,async(req, res) => {
        try{
            const {title,body}=req.body;
            const coverImage=req.file;
            const user = req.user;
            

            if(!coverImage){
                return res.render("loginSignup",{
                    msg:"You are Not Choose the Image!"
                })
            }

            const newBlog=new Blog({
                title,
                body,
                coverImage:coverImage.filename,
                createdBy:user.id,
            });
            
            await newBlog.save();
            // const allBlog=await Blog.find({})
            return res.redirect("/")

        }catch(err){
            throw err
        }
})


router.get("/addUser", async(req, res) => {
    try{
        return res.render("blog",({
            user:req.user,
            msg:"",
        }))

    }catch(err){
        throw err
    }
})


router.get("/:id", async(req, res) => {
    try{
        const blogID=req.params.id;
        const blog = await Blog.findById(blogID).populate("createdBy");
        
        const comments = await Comment.find({blogId:blogID}).populate("createdBy");

        return res.render("viewBlog",({
            user:req.user,
            msg:"",
            blog,
            comments,
        }))

    }catch(err){
        throw err
    }
})


router.post("/:blogId",async(req,res)=>{
    try{
        const {content}=req.body;
        const bid=req.params.blogId;
        const user=req.user;
        if(!content){
            return res.redirect(`/blog/${req.params.blogId}?message=Please%20Enter%20a%20Comment`)
            
        }
        await Comment.create({
            content:content,
            blogId:bid,
            createdBy:user.id,

        })
        return res.redirect(`/blog/${req.params.blogId}`)

    }catch(err){
        throw err
    }

})




module.exports=router;