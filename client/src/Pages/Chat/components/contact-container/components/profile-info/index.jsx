import React, { useEffect } from 'react'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { HOST, LOGOUT_ROUTE } from '@/utils/constant';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/Store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from "react-icons/io5";
import apiClient from '@/lib/api-client';

const ProfileInfo = () => {

    const { userInfo, setUserInfo } = useAppStore();
    // useEffect(() => {
    //     console.log("zutain store data : ", userInfo);
    // }, [userInfo]);

    const navigate = useNavigate();

    const logout = async () => {

        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
            if (response.status === 200) {
                navigate('/auth');
                setUserInfo(null);
            }

        } catch (error) {
            console.log(error)
        }

    }






    return (
        <div className='absolute bottom-0 h-16 flex justify-between items-center px-10 w-full bg-[#2a2b33]' >
            <div className="flex gap-3 items-center justify-center ">
                <div className='w-12 h-12 relative' >
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST}/${userInfo.image}`}
                                alt='profile'
                                className='object-cover w-full h-full bg-black'
                            />
                        ) : (
                            <div className={`uppercase h-12 w-12 text-2xl border-[1px] flex justify-center items-center rounded-full ${getColor(userInfo.color)}`} >
                                {
                                    userInfo.firstName
                                        ? userInfo.firstName.split("").shift()
                                        : userInfo.email.split("").shift()
                                }
                            </div>
                        )}

                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName
                            ? `${userInfo.firstName} ${userInfo.lastName}`
                            : " "
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 text-xl"
                                onClick={() => navigate('/profile')}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white " >Edit profile</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp
                                className="text-red-500 text-xl"
                                onClick={logout}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white " >logout</TooltipContent>
                    </Tooltip>
                </TooltipProvider>


            </div>

        </div>
    )
}

export default ProfileInfo
