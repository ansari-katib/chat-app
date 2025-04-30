import { useAppStore } from '@/Store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import ContactContainer from './components/contact-container';
import EmptyChatContainer from './components/empty-chat-container';

const Chat = () => {

    const { userInfo, selectedChatType , isUploading , isDownloading , fileUploadProgress , fileDownloadProgess } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast.error("please setup the profile before continue.");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    return (
        <div className='flex text-white h-[100vh] overflow-hidden'>
            {
                isUploading && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg' >
                    <h5 className='text-5xl animate-pulse' >Uploading File</h5>
                    {fileUploadProgress}%
                </div>
            }
            {
                isDownloading && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg' >
                    <h5 className='text-5xl animate-pulse' >Downloading File</h5>
                    {fileDownloadProgess}%
                </div>
            }
            <ContactContainer />
            {
                selectedChatType === undefined ?
                    (<EmptyChatContainer />)
                    : (<ChatContainer />)
            }


        </div>
    )
}

export default Chat
