import mongoose from "mongoose";


const messageSchema = mongoose.Schema({

    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: true,
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: false,
    },
    messageType: {
        type: String,
        enum:["text" , "file"],
        require: true,
    },
    content: {
        type: String,
        require: function (){
            return this.messageType === "text";
        },
    },
    fileUrl: {
        type: String,
        require: function (){
            return this.messageType === "file";
        },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }

})

const Message = mongoose.model("Messages" , messageSchema);
export default Message ;