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
        if (userInfo) {

            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
                console.log("connect to socket server");
            })

            const handleRecievedMessage = (message) => {
                const { selectedChatData, selectedChatType , addMessage } = useAppStore.getState();

                if (selectedChatType !== undefined && 
                    (selectedChatData._id === message.sender._id || 
                    selectedChatData._id === message.recipient._id)
                ){
                    console.log("message recieve : ",message);
                    addMessage(message);     
                }
            }

            socket.current.on("reciveMessage", handleRecievedMessage);

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