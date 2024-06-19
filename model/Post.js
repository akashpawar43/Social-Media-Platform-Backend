import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    description: String,
    picturePath: String,
    profilePicture: String,
    likes: {
        type: Map,
        of: Boolean
    },
    Comments: {
        type: [{
            id: String,
            name: String,
            username: String,
            profilePicture: String,
            comment: String,
        }]
    },
}, { timestamps: true })


const Post = mongoose.model("posts", postSchema);

export default Post;