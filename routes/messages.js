import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Message from "../model/Message.js";
import z from "zod";

const router = express.Router();   

const sendMessageBody = z.object({
    receiverId: z.string(),
    content: z.string().max(500)
});  

// Send a message using post method /api/v1/messages/send
router.post("/send", verifyToken, async (req, res) => {
    const { success, error } = sendMessageBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: error.issues.map(issue => issue.message)
        });
    }
    try {
        const senderId = req.userId;
        const { receiverId, content } = req.body;

        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            timestamp: new Date()
        });

        await newMessage.save();

        res.status(201).json({ message: "Message sent." });
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
});

// Get all messages between two users using get method /api/v1/messages/:userId
router.get("/:userId", verifyToken, async (req, res) => {
    try {
        const senderId = req.userId;
        const { userId: receiverId } = req.params;

        const messages = await Message.find({
            $or: [   
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});


export default router;