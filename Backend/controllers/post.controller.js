import sharp from "sharp";
import cloudinary from "../utils/cloudinary.utils.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import {Message} from "../models/message.model.js"
export const addNewPost = async(req , res) => {
   try {
    const {caption} = req.body;
    const {image} = req.file;
    const userID = req.id;
    
    if (!image) {
      return res.status(400).json({
         message:"Image required"
      })
    }
    const optimizeImage = await sharp(image.buffer)
    .resize({width:800 , height:800})
    .toFormat('jpeg' , {quality:80})
    
    const fileUri = `data:image/jpeg;base64 , ${optimizeImage.toString('base64')}`;
    const cloudeResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image:cloudeResponse.secure_url,
      author:userID
    })
    const user = await User.findById(userID);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({path:'author' , select:'-password'});
    return res.status(2001).json({
      message:"New post added",
      post,
      success:true
    })
   } catch (error) {
    console.log(error);
    
   }

}

export const getAllPosts = async(req , res) => {
   try {
      const posts = await Post.find().sort({createdAt:-1}).populate({path:'author' , select:'username , profilePicture'})
      .populate({
        path:'comments',
        sort:{createdAt:-1},
        populate:{
          path:'author',
          select:"username , profilePicture"
        }
      });
      return res.status(200).json({
       posts,
       success:true
      })
   } catch (error) {
      console.log(error);
      
   }
 };

 export const getUserPost = async(req , res) => {
  try {
    const userID = req.id;

    const posts = await Post.find({author:userID}).sort({createdAt:-1}).populate({
      path:'author',
      select:"username , profilePicture"
    }).populate({
      path:'comments',
      sort:{createdAt:-1},
      populate:{
        path:'author',
        select: 'username , profilePicture'
      }
    });
    return res.status(200).json({
      posts , 
      success : true
    })
  } catch (error) {
    console.log(error);
  }
 }


 export const LikePosts = async(req , res ) => {
  try {
    const LikeUser = req.id;
    const postID = req.params.id;
    const post = await Post.findById(postID);
    if (!post) return res.status(404).json({message:"Post not found" , success:false})

      await post.updateOne({$addToSet:{likes:LikeUser}})
      await post.save()

      // implement socket io for real time notification 

      return res.status(200).json({message:"Post liked" , success: true})
   } catch (error) {
    console.log(error);
    
  }
 }


 export const DislikePosts = async(req , res ) => {
  try {
    const LikeUser = req.id;
    const postID = req.params.id;
    const post = await Post.findById(postID);
    if (!post) return res.status(404).json({message:"Post not found" , success:false})

      await post.updateOne({$pull:{likes:LikeUser}})
      await post.save()

      // implement socket io for real time notification 

      return res.status(200).json({message:"Post Disliked" , success: true})
   } catch (error) {
    console.log(error);
    
  }
 }

 export const addComment = async (req , res) => {
  try {
    const postId = req.params.id;
    const user = req.id;

    const {text} = req.body;
    const post = await Post.findById(postId);
    if (!text) return res.status(400).json({message:"Filled the text" , success:false});
    const comment = await Comment.create({
      text,
      author:user,
      post:postId
    }).populate({
      path:"author",
      select:"username , profilePicture"
    });
    post.comments.puah(comment._id);
    await post.save();

    return res.status(201).json({
      message:"Comment Added",
      comment,
      success: true
    })

  } catch (error) {
    console.log(error);
    
  }
 }

 export const getCommentPost = async(req , res) => {
  try {
    const postID = req.params.id;
    const comments = await Comment.find({post:postID }).populate('author' , 'username' , 'profilePicture');
    if (!comments) return res.status(404).json({message:"No comments found for this post" , success:false});
    return res.status(200).json({success: true , comments})
  } catch (error) {
    console.log(error)
  }
 }

 export const delatePost = async(req , res) => {
try {
  const postId = req.params.id,
  authorId = req.id;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({message:"Post not found" , success : false})

    if(post.author.toString() !== authorId )return res.status(403).json({message:"Unauthorized"});
    await Post.findByIdAndDelete(postId);

    // user post

    let user = await User.findById(authorId)
    user.posts = user.posts.filter(id => id.toString() !== postId);
     

    await Comment.deleteMany({post: postId});


    return res.status(200).json({success: true , message:"Post deleted"})
} catch (error) {
  console.log(error);
  
}
 }


 export const BookMarkPost = async(req , res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({message:"Post not found" , success: false})
      const user = await User.findById(authorId)
    if(user.bookmarks.includes(post._id)){
      await user.updateOne({$pull:{bookmarks:post._id}});
      await user.save();
      return res.status(200).json({type:'unsave' , message:'Post remove from bookmark' , success: true})
    }else{
      await user.updateOne({$addToSet:{bookmarks:post._id}});
      await user.save();
      return res.status(200).json({type:'save' , message: 'Post bookmarked' , success: true});
    }
  } catch (error) {
    console.log(error);
    
  }
 }
 

