import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa6"
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/Store';
import { colors, getColor } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constant';

const profile = () => {

    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectColor, setSelectColor] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectColor(userInfo.color);
        }

        if (userInfo.image) {
            setImage(`${HOST}/${userInfo.image}`);
        }
    }, [userInfo]);


    const validateProfile = () => {
        if (!firstName) {
            toast.error("firstname is required");
            return false;
        }
        if (!lastName) {
            toast.error("lastname is required");
            return false;
        }
        return true;
    }


    const saveChange = async () => {
        if (validateProfile()) {
            try {
                const response = await apiClient.post(UPDATE_PROFILE_ROUTE,
                    { userId: userInfo.id, firstName, lastName, color: selectColor },
                    { withCredentials: true }
                )
                if (response.status === 200 && response.data) {
                    setUserInfo({ ...response.data });
                    toast.success("profile update successfully");
                    navigate("/chat");
                }

            } catch (error) {
                console.log("error : ", error.message);

            }
        }
    };


    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat");
        }
        else {
            toast.error("please setup profile");
        }
    }


    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }


    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profile-image", file);

        try {
            const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });

            if (response.status === 200 && response.data) {
                setUserInfo({ ...userInfo, image: response.data.image });
                toast.success("Image updated successfully");
                console.log(response.data.image);
            }
        } catch (error) {
            console.error("Error updating image: ", error);
        }

        // Read and set the local image preview
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("No file selected");
        }
    };


    const handleDeleteImage = async () => {
        try {
            const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,
                { userId: userInfo.id },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setUserInfo({ ...userInfo, image: null });
                toast.success("Image removed successfully");
                setImage(null);
            }
        } catch (error) {
            console.log("Error: ", error.message);
            toast.error("Failed to remove image");
        }
    };


    return (
        <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10' >
            <div className='flex flex-col gap-10 w-[80vw] md:w-max' >
                <div onClick={handleNavigate}>
                    <IoArrowBack className='text-white/90 text-4xl lg:text-6xl cursor-pointer ' />
                </div>
                <div className='grid grid-cols-2'>
                    <div
                        className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center'
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {image ? (
                                <AvatarImage
                                    src={image}
                                    alt='profile'
                                    className='object-cover w-full h-full bg-black'
                                />
                            ) : (
                                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-7xl border-[1px] flex justify-center items-center rounded-full ${getColor(selectColor)}`} >
                                    {
                                        firstName ? firstName.split("").shift()
                                            : userInfo.email.split("").shift()
                                    }
                                </div>
                            )}

                        </Avatar>
                        {
                            hovered && (
                                <div
                                    className='absolute inset-0  flex items-center justify-center bg-black/60 rounded-full ring-fuchsia-50'
                                    onClick={image ? handleDeleteImage : handleFileInputClick}
                                >
                                    {
                                        image ? (
                                            <FaTrash className='text-white text-3xl cursor-pointer ' />
                                        ) : (<FaPlus className='text-white text-3xl cursor-pointer ' />)
                                    }
                                </div>
                            )
                        }
                        <input type="file"
                            ref={fileInputRef}
                            className='hidden'
                            onChange={handleImageChange}
                            name='profile-image'
                            accept='.png , .jpg , .jpeg , .webp'
                        />
                    </div>
                    <div className='flex min-w-32 md:min-w-64 flex-col text-white items-center justify-center gap-5 '>
                        <div className='w-full'>
                            <Input
                                placeholder="Email"
                                type="email"
                                disabled
                                value={userInfo.email}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
                            />

                        </div>
                        <div className='w-full'>
                            <Input
                                placeholder="First Name"
                                type="text"
                                onChange={(e) => setFirstName(e.target.value)}
                                value={userInfo.firstName}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
                            />

                        </div>
                        <div className='w-full'>
                            <Input
                                placeholder="Last Name"
                                type="text"
                                onChange={(e) => setLastName(e.target.value)}
                                value={userInfo.lastName}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
                            />

                        </div>
                        <div className="w-full flex gap-5">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                                    ${selectColor === index ? "outline-white outline-3" : ""}`}
                                    onClick={() => setSelectColor(index)} // Set selected color index
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <Button
                        className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                        onClick={saveChange}
                    >Save Change</Button>
                </div>

            </div>
        </div>
    )
}

export default profile
