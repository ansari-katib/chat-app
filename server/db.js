import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

export const mongoDB = async () => {
    await mongoose.connect(dbUrl)
        .then(() => {
            console.log("db connecte successfully");
        }).catch((error) => {
            console.log("something error : ", error.message);
        })
}