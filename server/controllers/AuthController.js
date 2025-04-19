import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { existsSync, renameSync, unlinkSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
}


export const Signup = async (request, response) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("email and password is required");
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        })
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }
}


export const Login = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).send("email and password is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("user not found");
        }

        const auth = await compare(password, user.password);
        if (!auth) {
            return response.status(400).send("password is incorrect");
        }

        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })

        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        })

    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }

}


export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("user with the given id is not found");
        }

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color
        })

    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }
}

export const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request.body;
        const { firstName, lastName, color } = request.body;

        if (!firstName || !lastName || !color) {
            return response.status(400).send("First name, last name, color are required.");
        }

        const userData = await User.findByIdAndUpdate(userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true
            }, { new: true, runValidators: true }
        );

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color
        })

    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }
}

export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("file is required");
        }
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync(request.file.path, fileName);

        const updateUser = await User.findByIdAndUpdate(request.userId, { image: fileName }, { new: true, runValidators: true });

        return response.status(200).json({
            image: updateUser.image,
        })
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }
}


export const removeProfileImage = async (request, response, next) => {
    try {
        const { userId } = request.body;
        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).send("User not found");
        }

        if (user.image) {
            const filePath = path.join(__dirname, '..', user.image);

            if (existsSync(filePath)) {
                unlinkSync(filePath);
            } else {
                console.warn('File not found:', filePath);
            }
        }

        user.image = null;
        await user.save();

        return response.status(200).send("Profile image removed successfully");
    } catch (error) {
        console.error('Error while removing profile image:', error);
        response.status(500).json({
            message: "Internal server error",
            details: error.message
        });
    }
};

export const logout = async (request, response, next) => {
    try {
        response.cookie("jwt","",{maxAge:1, secure:true, sameSite:"None"});
        return response.status(200).send("Logout seuccessfully.")
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }

}