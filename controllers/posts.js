import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"
export const getPosts=async(req,res)=>{
    try{
        const postMessages=await PostMessage.find();
        // console.log(postMessages);
        res.status(200).json(postMessages);
    }catch(error){
        res.status(404).json({message:error.message})
    }
}

// Query -> /posts?page=1   --> page=1
// params -> /posts/:id  --> ex: /posts/123 --> id=123

export const getPostsBySearch = async (req, res) => {
    console.log("req",req.query)
    const { searchQuery, techs } = req.query;
    console.log("search",searchQuery)
    try {
        const title = new RegExp(searchQuery.trim(), "i"); // i-->ignores case
        // const exp=new RegExp("abc+d/E","i"); --> / abc + d\/E/i
        // easy for mongoose to search
        console.log(title,techs.split(','))
        const posts = await PostMessage.find({ $or: [{ title }, { techs: { $in: techs.split(',') } }] } )
        // $or --> either find title or techs
        // $in: is the techs in the array of techs equal to techs in database
        console.log("posts",posts)
        res.json({searchedData:posts})
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPost=async(req,res)=>{
    const post=req.body;
    const newPost=new PostMessage({...post,creator:req.userId,createdAt:new Date().toISOString()})
    try{
        await newPost.save();
        res.status(200).json(newPost);
    }catch(error){
        res.status(409).json({message:error.message})
    }
}
// /post/123
export const updatePost=async(req,res)=>{
    const {id:_id}=req.params;
    const post=req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send(`No post with the id : ${_id}`)
    }
    const updatedPost=await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new:true});
    res.json(updatedPost);
}

export const deletePost=async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`No post with the id : ${id}`)
    }
    await PostMessage.findByIdAndRemove(id);
    console.log("delete")
    res.json({message:'post deleted successfully'})
}

export const likePost=async(req,res)=>{
    const {id}=req.params;
    // console.log("req",req)
    // check if user is authenticated - auth middleware
    if(!req.userId) {return res.json({message:'Unathenticated'});}
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`No post with the id : ${id}`)
    }
    const post=await PostMessage.findById(id);

    // check if user has already liked or not --- only 1 like allowed
    const index=post.likes.findIndex((id)=>id===String(req.userId));
    // if user already liked, index will be some positive value, so next time he clicks like.. it will be dislike
    if(index===-1){
        // like
        post.likes.push(req.userId||"2")
    }else{
        // dislike
        post.likes=post.likes.filter(id=>id!==String(req.userId))
    }

    const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true})
    res.json(updatedPost)
}



