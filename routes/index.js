import express from "express";
import authRoutes from "./auth.js";
import usersRoutes from "./users.js";
import postsRoutes from "./post.js";
import messagesRoutes from "./messages.js"

const router = express.Router();

// Routes
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);
router.use("/messages", messagesRoutes);

export default router;