const express = require("express");
const {BlogModel} = require("../models/blogModel");
const {UserModel}=require("../models/userModel")
const jwt = require("jsonwebtoken");

const router=express.Router()

const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization;
    if(!token)
    {
        return res.status(401).json({error:"unothorized"})
    }
    jwt.verify(token,"masai",(err,decoded)=>{
        if(err)
        {
            return res.status(401).json({error:"unothorized"})
        }
        req.userID=decoded.userID;
        next()
    });
}
   
//to add the data in database
router.post("/add",verifyToken,async(req,res)=>{
    const {title,content,category}=req.body
    const userID=req.user.id
    try {
        const user=await UserModel.findById(userID)
        if(!user) return res.send("Please create Account first !")

        const newBlog= await BlogModel.create({
            user:userID,
            title,
            content,
            category,
            date: new Date(),
            likes:0,
            comments:[]
        })
        res.status(201).json(newBlog)
    } catch (error) {
        res.status(400).json({msg:"Error"})
    }
})


// Get all blogs (filtered by title and/or category, sorted by date)
router.get('/', verifyToken, async (req, res) => {
    const { title, category, sort, order } = req.query;
  
    const query = {};
  
    if (title) {
      query.title = title;
    }
    if (category) {
      query.category = category;
    }
  
    try {
      let blogs;
      if (sort === 'date' && (order === 'asc' || order === 'desc')) {
        blogs = await BlogModel.find(query)
          .populate('user', 'username')
          .sort({ date: order });
      } else {
        blogs = await BlogModel.find(query).populate('user', 'username');
      }
      
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blogs' });
    }
  });
  
  // Get a single blog by ID
  router.get('/:id', verifyToken, async (req, res) => {
    const blogId = req.params.id;
  
    try {
      const blog = await BlogModel.findById(blogId).populate('user', 'username');
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
  
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blog' });
    }
  });
  
  // Update a blog by ID
  router.put('/:id', verifyToken, async (req, res) => {
    const blogId = req.params.id;
    const { title, content, category } = req.body;
  
    try {
      const blog = await BlogModel.findById(blogId);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
  
      if (blog.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You do not have permission to update this blog' });
      }
  
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.category = category || blog.category;
  
      await blog.save();
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Error updating blog' });
    }
  });
  
  // Delete a blog by ID
  router.delete('/:id', verifyToken, async (req, res) => {
    const blogId = req.params.id;
  
    try {
      const blog = await BlogModel.findById(blogId);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
  
      if (blog.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You do not have permission to delete this blog' });
      }
  
      await blog.remove();
      res.status(204).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting blog' });
    }
  });
  
  // Like a blog by ID
  router.patch('/:id/like', verifyToken, async (req, res) => {
    const blogId = req.params.id;
  
    try {
      const blog = await BlogModel.findById(blogId);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
  
      blog.likes += 1;
      await blog.save();
  
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Error liking blog' });
    }
  });
  
  // Comment on a blog by ID
  router.patch('/:id/comment', verifyToken, async (req, res) => {
    const blogId = req.params.id;
    const { username, content } = req.body;
  
    try {
      const blog = await BlogModel.findById(blogId);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
  
      const newComment = {
        username,
        content,
      };
      blog.comments.push(newComment);
      await blog.save();
  
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Error commenting on blog' });
    }
  });





module.exports=router;

