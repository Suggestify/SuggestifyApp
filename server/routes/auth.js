import express from 'express'

import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import nodemailer from'nodemailer';

import User from "../models/User.js";
import AIMap from "../models/AIMap.js";
import TempUser from "../models/TempUser.js";
import UserSettings from '../models/UserSettings.js';
import Token from '../models/RefreshTokens.js';

import dotenv from 'dotenv';
dotenv.config();
const router = express.Router()

let refreshTokens = [];
const saltRounds = 10;


import {authenticateToken} from "../middleWare/secureEndPoint.js";


async function deleteUser(userName){
    await TempUser.deleteOne({userName: userName});
}

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    const tokenExists = await Token.findOne({token: refreshToken});
    if (!refreshToken || !tokenExists){
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            // Remove the invalid refresh token
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            return res.sendStatus(403);
        }
        const newAccessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        res.json({ accessToken: newAccessToken });
    });
});


router.post("/SignUp", async (req,res)=>{
    try{
        const userExists = await User.findOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] });
        if (userExists) {
            return res.status(400).send({ message: "An account with that email or username already exists." });
        }

        const secret = process.env.B_SECRET;
        const pwdDB = secret + req.body.password;

        const hashedPWD = await bcryptjs.hash(pwdDB, saltRounds)  // hashed password to pass into database
        const curEmail = req.body.email;
        const curUserName = req.body.userName;

        const emailVerificationToken = uuidv4();

        const data = {email: curEmail, userName: curUserName, password: hashedPWD, token: emailVerificationToken};
        const newTempUser = new TempUser(data);
        await newTempUser.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use false for STARTTLS; true for SSL on port 465
            auth: {
                user: 'suggestify.verify@gmail.com',
                pass: process.env.APP_PASSWORD,
            }
        });
        const link = `https://lafanda.github.io/VerificationPage/?token=${emailVerificationToken}`;

        const mailOptions = {
            from: 'suggestify.verify@gmail.com',
            to: curEmail,
            subject: 'Suggestify Email Verification, this link will expire in 5 minutes',
            text: link
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent: ', info.response);
            }
        });

        //req.session.user = {userName: curUserName, hasPremium: false}
        setTimeout(deleteUser, 300000);
        res.status(200).json({message: "Email sent for verification"})
    }
    catch(err){
        console.log(err)
        if(err.code === 11000){
            const field = Object.keys(err.keyValue)[0];
            res.status(400).send({ field: field,  message: `An account with that ${field} already exists.` });
        }
        else{
            res.status(400).send({ message: "Error creating account, please try again later" });
        }
    }
});

router.post("/SignIn", async (req,res)=>{
    try{
        const userId = req.body.UserId;
        let user;
        if(userId.includes("@")){
             user = await User.findOne({email: userId});
        }else{
             user = await User.findOne({userName: userId});
        }

        if (!user) {
            return res.status(401).send({ message: "Invalid login credentials" });
        }

        const pwdDB = user.password;  // password from database
        const pwdUser = process.env.B_SECRET + req.body.password;  // password on current input
        try {
            const match = await bcryptjs.compare(pwdUser, pwdDB);
            if (match) {
                const accessToken = jwt.sign({ username: user.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                const refreshToken = jwt.sign({ username: user.userName }, process.env.REFRESH_TOKEN_SECRET);

                const newToken = new Token({token: refreshToken});
                await newToken.save();

                let userSettings = await UserSettings.findById(user.UserSettingsID);
                let curStatus = userSettings.hasPremium;
                req.session.user = {userName: userId, hasPremium: curStatus}

                console.log(req.session.user);
                res.status(200).json({
                    access: accessToken,
                    refresh: refreshToken,
                    userName: user.userName
                });
            } else {
                res.status(401).send({ message: "Invalid login credentials" });
            }
        } catch (bcryptError) {
            console.error(bcryptError);
            res.status(500).send({ message: "An error occurred during the login process." });
        }
    } catch(err){
        res.status(400).send({message: "Invalid login credentials"});
    }
});

router.delete('/SignOut', authenticateToken, async (req, res) => {
    const token = req.body.token;
    console.log(token)
    const userName = req.body.userName;
    let user;
    try{

        user = await User.findOne({userName: userName});
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        let userSettings;
        try{
            userSettings = await UserSettings.findById(user.UserSettingsID);
            if (!userSettings) {
                return res.status(404).send({ message: "User settings not found" });
            }
            userSettings.notificationToken = undefined;
            userSettings.notificationsOn = false;
            await Token.deleteOne({token: token});
            await userSettings.save();
        }catch (err){
            console.log(err);
        }
    }catch (err){
        console.log(err);
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
    });
    res.sendStatus(204);
});

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