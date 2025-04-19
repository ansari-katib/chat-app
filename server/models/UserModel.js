import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "password is requires."],
    },
    firstName: {
        type: String,
        require: false
    },
    midlleName: {
        type: String,
        require: false
    },
    lastName: {
        type: String,
        require: false
    },
    image: {
        type: String,
        require: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    },
    color : {
        type:Number,
        require:false
    }


})

UserSchema.pre("save", async function (next) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
});

const User = mongoose.model("Users", UserSchema);

export default User;