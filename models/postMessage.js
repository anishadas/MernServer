import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    title:String,
    message:String,
    name:String,
    creator:String,
    hostingAt:String,
    selectedFile: String,
    techs: [String ],
    likes:{
        type:[String],
        default:[],
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
});



const PostMessage=mongoose.model('PostMessage',postSchema);

// module.exports={userDetails,PostMessage}

export default PostMessage;