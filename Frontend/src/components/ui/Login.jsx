import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";



const Login = () => {
    const [input, setInput] = useState({

        password: "",
        email: ""
    });

    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const signUpHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:3000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                navigate("/");
                
                toast.success(res.data.message);
                setInput({
                    password: "",
                    email: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "An error occurred");
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className="flex items-center w-screen h-screen justify-center bg-gradient-to-r  to-purple-600">
            <form onSubmit={signUpHandler} className="shadow-2xl flex flex-col gap-5 p-10 bg-white rounded-lg">
                <div className="my-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Logo</h1>
                    <p className="text-gray-600">Sign up to see photos and videos from your connections</p>
                </div>
            
                <div>
                    <label className="block text-gray-700">Email</label>
                    <Input
                        type="email"
                        name="email"
                        onChange={changeEventHandler}
                        value={input.email}
                        className="focus-visible:ring-transparent my-2 border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <Input
                        type="password"
                        name="password"
                        onChange={changeEventHandler}
                        value={input.password}
                        className="focus-visible:ring-transparent my-2 border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
        
                <Button type="submit" className="mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                    Login
                </Button>
                <span className="text-center">Doest not have en account? <Link to = "/signup" className = "text-blue-600">SignUp</Link></span>
            </form>
        </div>
    );
};

export default Login;
