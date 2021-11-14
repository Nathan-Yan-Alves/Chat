import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    username: { type: String, required: true },
    avatarUrl: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
});

const Message = model("Message", MessageSchema);

export default Message;
