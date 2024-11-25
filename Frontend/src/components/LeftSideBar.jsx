
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { setAuthUser } from "@/redux/authSlice";
import store from "@/redux/store";
import axios from "axios";
import { Heart , Search , TrendingUp , MessageCircle , PlusSquare , LogOut  , Home} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import CreatePost from "./ui/CreatPost";




const LeftSideBar = () => {
 const navigate = useNavigate();
 const { user } = useSelector(store => store.auth);
 const dispatch = useDispatch();
 const [open , setOpen] = useState(false);

  const LogOutUser = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/v1/user/logout' , {withCredentials:true});
    if (res.data.success) {
      dispatch(setAuthUser(null))
      navigate("/login")
      toast.success(res.data.message)
    }
   
  } catch (error) {
    console.log(error.response.data.message);
    
  }

  } 


  const sidebarHandler = (textType) => {
    if(textType === "Logout"){
     
      LogOutUser();
      
      
    }else if (textType === "Create"){
    setOpen(true)
   
 
  }};
  const sidebarItems = [
    {icon:<Home/> , text:"Home"},
    {icon:<Search/> , text:"Search"},
    {icon:<TrendingUp/> , text:"Explore"},
    {icon:<MessageCircle/> , text:"Messages"},
    {icon:<Heart/> , text:"Notification"},
    {icon:<PlusSquare/> , text:"Create"},
    {icon:<Avatar className = "h-6 w-6">
       <AvatarImage src={user?.profilePicture}/>
       <AvatarFallback>CN</AvatarFallback>
     </Avatar>
      , text:"Profile"},
      {icon:<LogOut/> , text:"Logout"},
]
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
        
        <div className="flex flex-col">
          <h1 className="my-8 pl-3 font-bold text-xl">Logo</h1>
          <div>
        {
            sidebarItems.map((item , index) => {
                return (
                    <div onClick={() => sidebarHandler(item.text)}  key={index} className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                )
           })   }  
        </div>
        
     
    </div>
    <CreatePost  open = {open} setOpen={setOpen}/>
    </div>
  );
  };

export default LeftSideBar