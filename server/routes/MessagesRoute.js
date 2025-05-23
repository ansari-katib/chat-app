import { Router } from 'express';
import { getMessages, uploadFile } from '../controllers/MessageController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js'
import multer from "multer";

const messagesRoutes = Router();
const upload = multer({ dest : "uploads/files/" });

messagesRoutes.post("/get-messages",verifyToken,getMessages);
messagesRoutes.post("/upload-files",verifyToken,upload.single("file"),uploadFile);

export default messagesRoutes;