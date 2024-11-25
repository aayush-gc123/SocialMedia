import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
  
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import {  FaRegHeart } from "react-icons/fa";

import { Button } from './button';
import CommentDialog from './CommentDialog';
import { useState } from 'react';

  


const Post = () => {
  const [Text, seText] = useState("")
 const [open, setOpen] = useState(false)


  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText)
    }else{
      setText("")
    }
  }
  const [text, setText] = useState("");
  return (
    <div className='my-8 w-full max-w-sm-auto'>
        <div className='flex items-center justify-between'>
    <div className='flex items-center gap-2'>
      <Avatar>
        <AvatarImage src = "" alt= "post_image"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h1>username</h1>
    </div>
    <Dialog >
  <DialogTrigger asChild >
    <MoreHorizontal className='cursor-pointer'/>
  </DialogTrigger>
  <DialogContent className='flex flex-col items-center text-sm text-center'>
    <Button variant = 'ghost ' className='cursor-pointer w-fit text-[#ED4956]'>Unfollow</Button>
    <Button variant = 'ghost ' className='cursor-pointer w-fit text-[#ED4956]'>Add to favorites</Button>
    <Button variant = 'ghost ' className='cursor-pointer w-fit'>Delate</Button>
  </DialogContent>
</Dialog>

    </div>
    <img 
    className="rounded-sm my-2 w-full aspect-square object-cover h-[80vh]"
    src="https://images.unsplash.com/photo-1719937206590-6cb10b099e0f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="post-image"/>

<div className="flex items-center justify-between my-2">
    <div className="flex items-center gap-3">
    <FaRegHeart size={'22px'}/>
    <MessageCircle onClick={() => setOpen(true)} className=" hover:text-gray-600 cursor-pointer"/>

<Send/>
    </div>
    <Bookmark/>
</div>
<span className="font-medium block mb-2">200k</span>
<p>
  <span className='font-medium mr-2'>username</span>
  caption
</p>
<span onClick={() => setOpen(true)}  className="text-gray-500 cursor-pointer">View all 10 comments</span>
<CommentDialog open={open} setOpen={setOpen}/>
<div className="flex items-center justify-between">
  <input 
  type = "text"
  placeholder="Add a comment...."
  value={text}
  onChange={changeEventHandler}
  className="outline-none text-sm w-full"/>
  {
    text && <span className="text-[#3BADF8]">Post</span>
  }
  
</div>
    </div>
  )
}

export default Post
