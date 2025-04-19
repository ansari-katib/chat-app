import { create } from "zustand";
import { createAuthSlice } from "./Slices/auth-slice";
import { CreateChatSlice } from "./Slices/chat-slice";

export const useAppStore  = create()((...a) => ({
    ...createAuthSlice(...a),
    ...CreateChatSlice(...a),
}))

