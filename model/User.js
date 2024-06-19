import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    username: {
        type: String,
        unique: true,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    profilePicture: {
        type: String,
        default: "https://www.pngfind.com/pngs/m/75-756588_png-file-single-user-icon-png-transparent-png.png"
    },
    friends: {
        type: [String],
        default: []
    },
    admin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model("users", UserSchema);

export default User;