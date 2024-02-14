import express from 'express'
import bcryptjs from "bcryptjs";
import User from "./models/User.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import AIMap from './models/AIMap.js';
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

        const initData = {Book:"NULL", Music:"NULL", Shows:"NULL", Game:"NULL", Hobbie:"NULL", Podcast:"NULL", Movie:"NULL"}
        const newAIMap = new AIMap(initData);
        await newAIMap.save();
        
        const data = {email: curEmail, userName: curUserName, password: hashedPWD, AIMap: newAIMap.id };  // email, username, password for database
        const currentUser = new User(data);
        await currentUser.save();

        const accessToken = jwt.sign({ username: curUserName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ username: curUserName }, process.env.REFRESH_TOKEN_SECRET);
        const token = {
            access: accessToken,
            refresh: refreshToken,
            userName: curUserName
        }
        res.json(token).status(200);
    }

    catch(err){
        if(err.code === 11000){
            const field = Object.keys(err.keyValue)[0];
            res.status(400).send({ field: field,  message: `An account with that ${field} already exists.` });
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
            user = await User.findOne({userName: UserId});
        }

        const pwdDB = user.password;  // password from database

        const secret = process.env.B_SECRET;
        const pwdUser = secret + req.body.password;  // password on current input

        bcryptjs.compare(pwdUser, pwdDB, function(err, match){
            if(err){
                console.log(err)
            }
            if(match){
                console.log(process.env.ACCESS_TOKEN_SECRET)
                const accessToken = jwt.sign({ username: user.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ username: user.userName }, process.env.REFRESH_TOKEN_SECRET);
                const token = {
                    access: accessToken,
                    refresh: refreshToken,
                    userName: user.userName

                }
                res.json(token).status(200);
            }
            else{
                console.log("no match");
                res.status(401).send({message: "login or password is incorrect"});
            }
        });
    } catch(err){
        res.status(400).send({message: "login or password is incorrect"});
    }
});

router.delete('/SignOut', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

router.put('/changeUsername', authenticateToken, async (req, res) => {
    try {
        const newUsername = req.body.newUsername;
        const currUsername =  req.body.username;

        if(newUsername.includes("@") || newUsername == ""){
            return res.status(400).send({ message: 'bad username' });
        }

        const usernameExists = await User.findOne({ userName: newUsername });
        if (usernameExists) {
            return res.status(400).send({ message: 'Username already taken' });
        }

        const user = await User.findOne({ userName: currUsername });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.userName = newUsername; // Update the username
        await user.save(); // Save the updated user to the database

        res.status(200).send({ message: 'Username successfully updated' });
    } catch (err) {
        // Handle any errors
        res.status(500).send({ message: 'Error updating username' });
    }
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