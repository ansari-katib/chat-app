import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const SearchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;

        if (searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("serachTerm is required");
        }

        const sanitizeSearchTerm = (searchTerm) => {
            return searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        };

        const regex = new RegExp(sanitizeSearchTerm(searchTerm), "i");

        const contacts = await User.find({
            $and:
                [
                    { _id: { $ne: request.userId } },
                    { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }
                ]
        })
        // console.log(contacts);
        return response.status(200).json({ contacts });
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }

}

export const getContactsForDMList = async (request, response, next) => {
    try {

        let { userId } = request;
        userId = new mongoose.Types.ObjectId(userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(400).json({ error: "Invalid user ID" });
        }


        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                }
            },
            {
                $sort: { lastMessageTime: -1 },
            }
        ]);

        return response.status(200).json({ contacts });
    } catch (error) {
        response.status(500).send(`Internal server error: ${error.message}`);
    }

}

export const getAllContact = async (request, response, next) => {
    try {
        const users = await User.find(
            { _id: { $ne: request.userId } },
            "firstName lastName _id email"
        );

        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }));

        return response.status(200).json({ contacts });
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }

}