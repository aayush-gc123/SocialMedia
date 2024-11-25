
import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Login from "./components/ui/Login";
import SignUp from "./components/ui/SignUp";
import MainLayout from "./components/ui/MainLayout";
import Home from "./components/ui/Home";
import Profile from "./components/Profile";
 
 const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/Profile',
        element:<Profile/>
      }

    ]

  },
  {
    path: '/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<SignUp/>
  }
 ])
export default function App() {
  return (
    <div>
     <RouterProvider router = {browserRouter}/>

    </div>
  )
}