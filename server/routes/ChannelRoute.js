import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel, getChannelsMessages, getUserChannels } from "../controllers/ChannelController.js";

const ChannelRoute = Router();

ChannelRoute.post("/create-channel",verifyToken , createChannel);
ChannelRoute.get("/get-user-channel" ,verifyToken ,getUserChannels);
ChannelRoute.get("/get-channel-messages/:channelId" ,verifyToken ,getChannelsMessages);


export default ChannelRoute;