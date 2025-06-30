import { useEffect, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from "react-icons/ri"
import { IoSend } from "react-icons/io5"
import { useRef } from "react"
import EmojiPicker from "emoji-picker-react"
import { useAppStore } from "@/Store"
// import { Socket } from "socket.io-client"
import { useSocket } from "@/context/socketContext"
import apiClient from "@/lib/api-client"
import { FILE_UPLOAD_ROUTE } from "@/utils/constant"

const MessageBar = () => {

    const socket = useSocket();
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const { selectedChatType, selectedChatData, userInfo, setFileUploadProgress, setIsUploading } = useAppStore();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        function handleClickOutSide(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutSide)
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide)
        }
    }, [emojiRef])

    const handleSendMessage = async () => {

        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
        } else if (selectedChatType === "Channel") {
            socket.emit("send-channel-message", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id,
            });
        }

        // purpose : socket error handling  
        if (selectedChatType === 'contact') {
            console.log("contact message : ", message);
            console.log("message type : ", selectedChatType);
            // emit sendMessage

        } else if (selectedChatType === 'Channel') {
            console.log("channel message : ", message);
            console.log("message type : ", selectedChatType);
            // emit sendChannelMessage

        }

        setMessage("");
    }

    const handleAttachmentCLick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0];

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);

                const response = await apiClient.post(FILE_UPLOAD_ROUTE,
                    formData,
                    {
                        withCredentials: true, onUploadProgress: data => {
                            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
                        }
                    },

                );

                if (response.status === 200 && response.data) {
                    setIsUploading(false);
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: null,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                        });

                    } else if (selectedChatType === "Channel") {
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: null,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id,
                        });
                    }
                }
                console.log(response.data.filePath);
            }
            console.log(file);
        } catch (error) {
            setIsUploading(false);
            console.log({ error });
        }
    }

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    }

    return (
        <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-5 gap-6' >
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5" >
                <input
                    type="text"
                    placeholder="Enter Your Message"
                    className="flex-1 p-3 bg-transparent rounded-none focus:border-none focus:outline-none "
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    onClick={handleAttachmentCLick}
                >
                    <GrAttachment className="text-2xl" />
                </button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
                <div className="relative ">
                    <button
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={() => setEmojiPickerOpen(true)}
                    >
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef} >
                        <EmojiPicker
                            theme="dark"
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}

                        />
                    </div>

                </div>

            </div>
            <button
                className="bg-[#8417ff] rounded-md flex items-center justify-center p-3 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                onClick={handleSendMessage}
            >
                <IoSend className="text-2xl" />
            </button>

        </div>
    )
}

export default MessageBar
