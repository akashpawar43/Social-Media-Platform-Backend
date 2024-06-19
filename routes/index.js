import express from "express";
import authRoutes from "./auth.js";
import usersRoutes from "./users.js";
import postsRoutes from "./post.js";

const router = express.Router();

// Routes
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);

export default router;