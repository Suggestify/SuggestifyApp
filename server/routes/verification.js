import express from 'express'

import jwt from 'jsonwebtoken'

import User from "../models/User.js";
import AIMap from "../models/AIMap.js";
import TempUser from "../models/TempUser.js";
import UserSettings from '../models/UserSettings.js';
import Token from '../models/RefreshTokens.js';

import dotenv from 'dotenv';
dotenv.config();
const router = express.Router()

router.get('/verify-email', async (req, res) => {
    console.log("called")
    const { token } = req.query;
    try {
        const tokenExists = await TempUser.findOne({ token: token });
        if (!tokenExists) return res.status(400).send('Invalid or expired token.');

        tokenExists.token = "Verified";
        await tokenExists.save();
        res.send('Email verified successfully!');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/verified', async (req, res) => {
    console.log("verify called");
    const userName = req.query.userName;  // Accessing userName from query parameters
    console.log(userName);
    if (!userName) {
        return res.status(400).send({ message: "No username provided" });
    }
    try {
        const user = await TempUser.findOne({ userName: userName });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        if (user.token === "Verified") {
            const userSettings = new UserSettings();
            await userSettings.save();

            const newAIMap = new AIMap();
            await newAIMap.save();

            const newUser = new User({ email: user.email, userName: userName, password: user.password, AIMap: newAIMap._id, UserSettingsID: userSettings._id });
            await newUser.save();
            const accessToken =  jwt.sign({ username: userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
            const refreshToken =  await jwt.sign({ username: userName }, process.env.REFRESH_TOKEN_SECRET);
            if (refreshToken) {
                const newToken = new Token({ token: refreshToken });
                if(newToken.token != null) {
                    await newToken.save();
                }
            } else {
                console.error("Failed to generate a valid token.");
            }
            await TempUser.deleteOne({ userName: userName });

            const token = {
                access: accessToken,
                refresh: refreshToken,
                userName: userName
            }
            req.session.user = {userName: userName, hasPremium: false}
            res.json(token).status(200);
        } else {
            console.log("Email not")
            res.status(204).send({ message: "Email not verified" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

router.delete('/cancel', async (req, res) => {
    const userName = req.query.userName;
    try {
        await TempUser.deleteOne({userName: userName});
        res.status(200).send({message: "User creation cancelled"});
    } catch (err) {
        res.status(500).send({message: "Internal server error"});
    }
});




export default router