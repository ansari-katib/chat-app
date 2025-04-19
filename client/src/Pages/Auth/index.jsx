import React, { useState } from 'react'
import { TabsContent, Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Sign_image from "../../assets/chat-app.jpg";
import { toast } from 'sonner';
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGINUP_ROUTE } from '@/utils/constant';
import { useAppStore } from '@/Store';
import { useNavigate } from 'react-router-dom';

const Auth = () => {

    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const validateSignup = () => {
        if (!email.length) {
            toast.error("email is required");
            return false;
        }
        if (!password.length) {
            toast.error("password is required");
            return false;
        }
        if (!ConfirmPassword.length) {
            toast.error("confirm password is requires ");
            return false;
        }
        if (password !== ConfirmPassword) {
            toast.error("password and confirm password should be the same");
            return false;
        }
        return true
    }

    const validateLogin = () => {
        if (!email.length) {
            toast.error("email is required");
            return false;
        }
        if (!password.length) {
            toast.error("password is required");
            return false;
        }
        return true
    }

    const handleLogin = async () => {
        try {
            if (validateLogin()) {
                const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
                if (response.data.user.id) {
                    setUserInfo(response.data.user);
                    if (response.data.user.profileSetup) {
                        navigate("/chat");
                    } else {
                        navigate("/profile")
                    }
                }
                toast.success("login successfully :)");
                console.log("the response : ", response);
            }

        } catch (error) {
            console.log("error message : ", error.message);
        }
    }

    const handleSignup = async () => {
        try {
            if (validateSignup()) {
                const response = await apiClient.post(SIGINUP_ROUTE, { email, password }, { withCredentials: true });
                if (response.status === 201) {
                    setUserInfo(response.data.user);
                    navigate("/profile");
                }
                toast.success("signup successfully :");
                console.log("response", response);
            }

        } catch (error) {
            toast.error("signup error");
            console.log("error", error.message);
        }
    }


    return (
        <>
            <div className=" bg-gray-300 h-[100vh] w-[100vw] flex flex-col items-center justify-center">
                <div className='h-[80vh] bg-white border-2 border-white opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl flex justify-center items-center'>
                    <div className='grid xl:grid-cols-2 xl:gap-10 m-10'>
                        <div className='flex items-center justify-center flex-col'>
                            <div className='flex justify-center items-center m-5'>
                                <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                            </div>
                            <p>Get started with the best chat app </p>
                            <div className='flex items-center justify-center w-full' >
                                <Tabs className="w-3/4" defaultValue="login" >
                                    <TabsList className="w-full bg-transparent rounded-none" >
                                        <TabsTrigger
                                            value="login"
                                            className="data-[state=active]:bg-transparent text-black opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                        >Login
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="signup"
                                            className="data-[state=active]:bg-transparent text-black opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                        >Signup
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="login" className="flex flex-col gap-5 mt-10" >
                                        <Input
                                            placeholder="email"
                                            type="email"
                                            name="email"
                                            className="p-6 rounded-full"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Input
                                            placeholder="password"
                                            type="password"
                                            name="password"
                                            className="p-6 rounded-full"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Button
                                            className="rounded-full p-6"
                                            onClick={handleLogin}
                                        >Login</Button>
                                    </TabsContent>
                                    <TabsContent value="signup" className="flex flex-col gap-5 mt-10">
                                        <Input
                                            placeholder="email"
                                            type="email"
                                            name="email"
                                            className="p-6 rounded-full"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Input
                                            placeholder="password"
                                            type="password"
                                            name="password"
                                            className="p-6 rounded-full"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Confirm password"
                                            type="password"
                                            name="password"
                                            className="p-6 rounded-full"
                                            value={ConfirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <Button
                                            className="rounded-full p-6"
                                            onClick={handleSignup}
                                        >Signup</Button>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                        <div className='hidden xl:flex justify-center items-center ' >
                            <img src={Sign_image} placeholder="iamge" className='h-[450px]' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth
