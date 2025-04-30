export const CreateChatSlice = (set, get) => ({

    selectedChatType: undefined,
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

    selectedChatData: undefined,
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

    selectedChatMessages: [],
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),

    directMessagesContacts: [],
    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),

    channels: [],
    setChannel: (channels) => set({ channels }),

    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] });
    },

    isUploading: false,
    setIsUploading: (isUploading) => set({ isUploading }),

    isDownloading: false,
    setIsDownloading: (isDownloading) => set({ isDownloading }),

    fileUploadProgress: 0,
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),

    fileDownloadProgess: 0,
    setFileDownloadProgess: (fileDownloadProgess) => set({ fileDownloadProgess }),

    closeChat: () =>
        set({
            selectedChatData: undefined,
            selectedChatType: undefined,
            selectedChatMessages: []
        }),

    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get.selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages,
                {
                    ...message,

                    recipient:
                        selectedChatType === "channel"
                            ? message.recipient
                            : message.recipient._id,

                    sender:
                        selectedChatType === "channel"
                            ? message.sender
                            : message.sender._id,

                }
            ]
        })
    }



});