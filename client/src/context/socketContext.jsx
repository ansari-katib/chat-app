import { useAppStore } from "@/Store";
import { HOST } from "@/utils/constant";
import { useEffect, useRef, createContext, useContext } from "react";
import { io } from "socket.io-client";


const socketContext = createContext(null);


export const useSocket = () => {
    return useContext(socketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo && userInfo.id) {

            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
                console.log("connect to socket server");
            })

            const handleRecievedMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

                if (selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    console.log("message recieve : ", message);
                    addMessage(message);
                }
            }

            const handleRecievedChannelMessage = (message) => {
                console.log("Received channel message:", message);  // ✅ Check if this logs
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
                if (selectedChatType !== undefined && selectedChatType === 'channel' && selectedChatData._id === message.channelId) {
                    addMessage(message);
                }
            };

            socket.current.on("receiveMessage", handleRecievedMessage);
            socket.current.on("receive-channel-message", handleRecievedChannelMessage);

            return () => {
                socket.current.disconnect();
            }
        }

    }, [userInfo])

    return (

        <socketContext.Provider value={socket.current} >
            {children}
        </socketContext.Provider>
    )
}