import express from 'express'
import bcryptjs from "bcryptjs";
import User from "./models/User.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import AIMap from './models/AIMap.js';
import UserSettings from './models/UserSettings.js';
import axios from "axios";
dotenv.config();
const router = express.Router()

let refreshTokens = [];
const saltRounds = 10;




router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
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

        const accessToken = jwt.sign({ username: curUserName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ username: curUserName }, process.env.REFRESH_TOKEN_SECRET);
        const token = {
            access: accessToken,
            refresh: refreshToken,
            userName: curUserName
        }
        const response = await
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
    console.log("Sign In Request Received")
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
                const accessToken = jwt.sign({ username: user.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ username: user.userName }, process.env.REFRESH_TOKEN_SECRET);
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

router.delete('/SignOut', async (req, res) => {
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
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next(); // Proceed to the protected route
    });
}

export default router