import express from "express";
import { verifyToken } from "../middleware/auth.js";
import User from "../model/User.js";
import Notification from "../model/Notification.js";
import z from "zod";

const router = express.Router();

// Get specific user details using get method /api/v1/users/:id
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id }).select("-password");
        res.json({
            user,
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

// Get Friends list / followers using get /api/v1/users/:id/friends
router.get("/:id/friends", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById({ _id: id }).select("-password");

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id).select("-password"))
        )

        const formattedFriends = friends.map(
            ({ _id, name, username, profilePicture }) => {
                return { _id, name, username, profilePicture };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });

    }
});

// follow and unfollow user using patch /api/v1/users/:id/:friendId
router.patch("/:id/:friendId", verifyToken, async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id).select("-password")
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id).select("-password"))
        )

        const formattedFriends = friends.map(
            ({ _id, name, username, profilePicture }) => {
                return { _id, name, username, profilePicture };
            }
        );
        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

const followNotificationBody = z.object({
    followerId: z.string()
});

// Send notification of new follower using post method /api/v1/users/:userId/followers
router.post("/:userId/followers", verifyToken, async (req, res) => {
    const { success, error } = followNotificationBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: error.issues.map(issue => issue.message)
        });
    }
    try {
        const { userId } = req.params;
        const { followerId } = req.body;

        const user = await User.findById(userId);
        const follower = await User.findById(followerId);

        if (!user || !follower) {
            return res.status(404).json({ message: "User or follower not found" });
        }

        const notification = new Notification({
            userId,
            type: "newFollower",
            message: `${follower.name} (@${follower.username}) started following you.`,
            createdAt: new Date()
        });

        await notification.save();

        res.status(201).json({ message: "Notification sent." });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
});

export default router;