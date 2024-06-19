import express from "express";
import { verifyToken } from "../middleware/auth.js";
import User from "../model/User.js";
import Post from "../model/Post.js";
import mongoose from "mongoose";


const router = express.Router();

// create post end point using post method /api/v1/posts/createpost
router.post("/createpost", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { description, picturePath } = req.body;
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            name: user.name,
            username: user.username,
            description,
            picturePath,
            profilePicture: user.profilePicture,
            likes: {},
            Comments: []
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
});

// get all Feed post using get method /api/v1/posts/
router.get("/", verifyToken, async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

// get all User post using get method /api/v1/posts/:userId/posts
router.get("/:userId/posts", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

// likes on post using patch method /api/v1/posts/:id/likes
router.patch("/:id/likes", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.get(userId.toString());

        if (isLiked) {
            post.likes.delete(userId.toString());
        } else {
            post.likes.set(userId.toString(), true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

// Comment on post using patch method /api/v1/posts/:id/comment
router.patch("/:id/comment", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            id: new mongoose.Types.ObjectId().toString(),
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            comment
        }

        post.Comments.push(newComment);

        const updatedPost = await post.save();

        res.status(200).json({ updatedPost });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

export default router;