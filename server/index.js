import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { mongoDB } from "./db.js"
import cookieParser from "cookie-parser"
import authRoute from "./routes/AuthRoute.js"
import ContactsRoute from "./routes/ContactRoute.js"
import setupSocket from "./socket.js"
import messagesRoutes from "./routes/MessagesRoute.js"
import ChannelRoute from "./routes/ChannelRoute.js"
dotenv.config();

// DB  connection
mongoDB();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}))

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoute)
app.use("/api/contacts",ContactsRoute);
app.use("/api/messages",messagesRoutes);
app.use("/api/channel" , ChannelRoute);

const server = app.listen(port, () => {
    console.log(`server is running on port : http://localhost:${port}`);
}) 

setupSocket(server);