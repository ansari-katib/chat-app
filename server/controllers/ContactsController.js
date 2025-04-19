import User from "../models/UserModel.js";

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
                    { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]}
                ]
        })
        // console.log(contacts);
        return response.status(200).json({ contacts });
    } catch (error) {
        response.status(500).send("Internal server error", error.message);
    }

}