import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel, getUserChannels } from "../controllers/ChannelController.js";

const ChannelRoute = Router();

ChannelRoute.post("/create-channel",verifyToken , createChannel);
ChannelRoute.get("/get-user-channel" ,verifyToken ,getUserChannels);

export default ChannelRoute;