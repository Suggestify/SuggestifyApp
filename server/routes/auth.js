import express from 'express'
const router = express.Router()

import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import nodemailer from'nodemailer';

import User from "../models/User.js";
import TempUser from "../models/TempUser.js";
import UserSettings from '../models/UserSettings.js';
import Token from '../models/RefreshTokens.js';

import dotenv from 'dotenv';
dotenv.config();

import { v4 as uuidv4 } from 'uuid';
import {authenticateToken} from "../middleWare/secureEndPoint.js";

const saltRounds = 10;

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
        const tokenExists = await Token.findOne({token: refreshToken});
        if (!tokenExists){
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                await Token.deleteOne({ token: refreshToken });
                return res.status(403).json({ message: "Failed to verify refresh token" });
            }
            const newAccessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Error handling refresh token:", error);
        res.status(500).json({ message: "Internal server error during token refresh" });
    }
});

router.post("/SignUp", async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        if (!email || !userName || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: "An account with that email already exists", field: "email" });
        }

        const userNameExists = await User.findOne({ userName });
        if (userNameExists) {
            return res.status(409).json({ message: "An account with that username already exists", field: "userName" });
        }

        const pwdDB = process.env.B_SECRET + password;
        const hashedPWD = await bcryptjs.hash(pwdDB, saltRounds);
        const emailVerificationToken = uuidv4();
        const data = { email, userName, password: hashedPWD, token: emailVerificationToken };
        const newTempUser = new TempUser(data);
        await newTempUser.save();

        const emailSent = await sendVerificationEmail(email, emailVerificationToken);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        setTimeout(() => deleteUser(userName), 300000); // Adjust timeout to 5 minutes
        res.status(200).json({ message: "Email sent for verification" });
    } catch (err) {
        console.error("Error during sign-up:", err);
        res.status(500).json({ message: "Internal server error during sign-up" });
    }
});


router.post("/SignIn", async (req, res) => {
    const { UserId } = req.body;
    if (!UserId) {
        return res.status(400).json({ message: "User identification is required" });
    }

    try {
        const userQuery = UserId.includes("@") ? { email: UserId } : { userName: UserId };
        const user = await User.findOne(userQuery);

        if (!user) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

        const pwdUser = process.env.B_SECRET + req.body.password;
        const match = await bcryptjs.compare(pwdUser, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

        const accessToken = jwt.sign({ username: user.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ username: user.userName }, process.env.REFRESH_TOKEN_SECRET);
        const newToken = new Token({ token: refreshToken });
        await newToken.save();

        const userSettings = await UserSettings.findById(user.UserSettingsID);
        req.session.user = { userName: user.userName, hasPremium: userSettings?.hasPremium || false };

        res.status(200).json({
            access: accessToken,
            refresh: refreshToken,
            userName: user.userName
        });
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "An error occurred during the login process" });
    }
});


// Endpoint for user sign-out
router.delete('/SignOut', authenticateToken, async (req, res) => {
    const { token, userName } = req.body;
    if (!token || !userName) {
        return res.status(400).json({ message: "Token and user name are required for sign-out" });
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).json({ message: "User settings not found" });
        }

        userSettings.notificationToken = undefined;
        userSettings.notificationsOn = false;
        await userSettings.save();
        await Token.deleteOne({ token });

        req.session.destroy((err) => {
            if (err) {
                console.error("Session destruction error:", err);
                return res.status(500).json({ message: "Failed to log out" });
            }
            res.sendStatus(204);  // No content to send back
        });
    } catch (error) {
        console.error("Sign-out error:", error);
        res.status(500).json({ message: "An error occurred during the sign-out process" });
    }
});

async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'suggestify.verify@gmail.com',
            pass: process.env.APP_PASSWORD,
        }
    });
    const link = `https://lafanda.github.io/VerificationPage/?token=${token}`;
    const mailOptions = {
        from: 'suggestify.verify@gmail.com',
        to: email,
        subject: 'Suggestify Email Verification, this link will expire in 5 minutes',
        text: link
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

async function deleteUser(userName){
    try {
        await TempUser.deleteOne({userName: userName});
    } catch (error) {
        console.error("Failed to delete temporary user:", error);
    }
}


export default router