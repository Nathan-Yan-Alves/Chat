import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: String,
    avatarUrl: String,
});
const User = model("User", UserSchema);

export default User;
