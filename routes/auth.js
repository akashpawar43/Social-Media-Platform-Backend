import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import z from "zod";
import User from "../model/User.js";
import mongoose from "mongoose";
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

const registerBody = z.object({
    name: z.string().min(2).max(50),
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(5).max(50),
    profilePicture: z.string().optional()
});

const signinBody = z.object({
    email: z.string().email(),
    password: z.string().min(5).max(50),
});

// register user endpoint using post method /api/v1/auth/register
router.post("/register", async (req, res) => {
    const validatedRegister = registerBody.safeParse(req.body);
    if (!validatedRegister.success) {
        return res.status(411).json({
            message: validatedRegister.error.issues.map(issue =>
                issue.message
            )
        });
    }
    try {
        const { name, username, email, password, profilePicture } = validatedRegister.data;
        const exist = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (exist) {
            const errorMessage = exist.email === email ? "Email already exists" : "Username already exists";
            return res.status(400).json({
                success: false,
                message: errorMessage
            });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        const user = await User.create({
            name: name,
            username: username,
            email: email,
            password: secPass,
            profilePicture: profilePicture
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign({ data }, JWT_SECRET);
        res.status(201).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error!"
        });
    }
});

// signin user endpoint using post method /api/v1/auth/signin
router.post("/signin", async (req, res) => {
    const validatedSignin = signinBody.safeParse(req.body);
    if (!validatedSignin.success) {
        return res.status(411).json({
            message: validatedSignin.error.issues.map(issue => issue.message)
        });
    }
    try {
        const { email, password } = validatedSignin.data;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please try to Signin with correct creditentials",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Please try to login with correct creditentials",
            });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECRET);
        // converting mongoose object to javascript object 
        const obj = user.toObject();
        delete obj.password;

        res.status(201).json({
            success: true,
            user: obj,
            token,
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error!"
        });
    }
});



export default router;