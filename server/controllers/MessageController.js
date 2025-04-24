import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (request, response, next) => {
    try {
        const user1 = request.userId;
        const user2 = request.body.id;

        if (!user1 || !user2) {
            return response.status(400).send("user ids are required.");
        }

        const message = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ]
        }).sort({ timestamp: 1 });

        return response.status(200).json({ message });
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }
}


export const uploadFile = (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("file is required");
        }

        const date = Date.now();
        let fileDr = `uploads/files/${date}`;
        let fileName = `${fileDr}/${request.file.originalname}`;

        mkdirSync(fileDr, { recursive: true });
        renameSync(request.file.path, fileName);

        return response.status(200).json({ filePath: fileName });
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }
}