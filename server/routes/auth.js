import express from 'express'
import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import AIMap from '../models/AIMap.js';
import UserSettings from '../models/UserSettings.js';
import Token from '../models/Tokens.js';
dotenv.config();
const router = express.Router()

let refreshTokens = [];
const saltRounds = 10;

import {authenticateToken} from "../middleware.js";

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
        const secret = process.env.B_SECRET;
        const pwdDB = secret + req.body.password;

        const hashedPWD = await bcryptjs.hash(pwdDB, saltRounds)  // hashed password to pass into database
        const curEmail = req.body.email;
        const curUserName = req.body.userName;

        const initData = {Music:"NULL", Books:"NULL", Shows:"NULL", Podcasts:"NULL", Movies:"NULL", Hobbies:"NULL", Games:"NULL"}
        const newAIMap = new AIMap(initData);
        await newAIMap.save();

        const NewUserSettings = new UserSettings();
        await NewUserSettings.save();

        const data = {email: curEmail, userName: curUserName, password: hashedPWD, AIMap: newAIMap.id, UserSettingsID: NewUserSettings.id };  // email, username, password for database
        const currentUser = new User(data);
        await currentUser.save();

        const accessToken =  jwt.sign({ username: curUserName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        //const refreshToken =  await jwt.sign({ username: curUserName }, process.env.REFRESH_TOKEN_SECRET);
        const refreshToken = 7;
        if (refreshToken) {
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        } else {
            console.error("Failed to generate a valid token.");
        }


        const token = {
            access: accessToken,
            refresh: refreshToken,
            userName: curUserName
        }

        res.json(token).status(200);
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
            await userSettings.save();
        }catch (err){
            console.log(err);
        }
    }catch (err){
        console.log(err);
    }
    await Token.deleteOne({token: token});
    res.sendStatus(204);
});

export default router