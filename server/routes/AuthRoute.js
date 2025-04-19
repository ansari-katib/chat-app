import { Router } from "express";
import { Login, Signup, getUserInfo, updateProfile, addProfileImage ,removeProfileImage, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/profiles/" });

const authRoute = Router();

authRoute.post("/signup", Signup);
authRoute.post("/login", Login);
authRoute.get("/user-info", verifyToken, getUserInfo);
authRoute.post("/update-profile", verifyToken, updateProfile);
authRoute.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoute.delete("/remove-profile-image",verifyToken,removeProfileImage);
authRoute.post("/logout",logout);

export default authRoute;