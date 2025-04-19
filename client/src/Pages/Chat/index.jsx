import { useAppStore } from '@/Store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import ContactContainer from './components/contact-container';
import EmptyChatContainer from './components/empty-chat-container';

const Chat = () => {

    const { userInfo, selectedChatType } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast.error("please setup the profile before continue.");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    return (
        <div className='flex text-white h-[100vh] overflow-hidden'>
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
