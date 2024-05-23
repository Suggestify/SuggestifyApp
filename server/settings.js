import express from 'express'
import User from "./models/User.js";
import UserSettings from "./models/UserSettings.js";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router()
import cron from 'node-cron';
import pkg from '../client/notifications.js';
const { sendPushNotifications } = pkg;


cron.schedule('0 21 * * 0', () => {
    console.log('This message logs every Sunday at 9 PM.');
    sendPushNotifications();
});
router.post("/setNotifications", async (req, res) => {
    const userName = req.body.userName;
    const token = req.body.token;
    console.log(userName);
    if (!userName || !token) {
        return res.status(400).send({ message: "Missing userID or token" });
    }
    try {
        let user = await User.findOne({ userName: userName});
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let userSettings = await UserSettings.findById(user.UserSettingsID);
        userSettings.notificationToken = token; // Directly assign the token to the user model

        await userSettings.save(); // Save the updated user to the database

        res.status(200).json({ message: "Notification token updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to update notification token" });
    }
});

router.get("/fetchSettings", async (req, res) => {
    const userName = req.query.userName;
    try {
        let user = await User.findOne({userName: userName});
        const userSettingsID = user.UserSettingsID;
        try{
            let userSettings = await UserSettings.findById(userSettingsID);
            if (!userSettings) {
                return res.status(404).send({message: "User settings not found"});
            }
            console.log(userSettings)
            res.status(200).json(userSettings);
        } catch (err) {
            console.log(err);
            res.status(500).send({message: "Failed to fetch user settings"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({message: "Failed to fetch user settings"});
    }
})

router.put("/updateOrder", async (req, res) => {
    const userName = req.body.userName;
    const newOrder = req.body.order;
    try {
        let user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        let userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).send({ message: "User settings not found" });
        }
        userSettings.mediumOrder = newOrder;
        await userSettings.save();
        res.status(200).send({ message: "User settings updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to update user settings" });
    }
})

router.post("/toggleSwitch", async (req, res) => {
const userName = req.body.userName;
    const switchType = req.body.switchType;
    const switchState = req.body.value;

    try {
        let user = await User.findOne({userName: userName});
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        let userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).send({message: "User settings not found"});
        }
        userSettings[switchType] = switchState;
        await userSettings.save();
        if(switchType === "notificationOn" ){
            if(userSettings.notificationToken == undefined && switchState){
                res.status(200).send({message: "Notification enabled", firstTime: true})
            }
        }
        res.status(200)
    } catch(err){
        console.log(err);
        res.status(500).send({message: "Failed to toggle switch"});
    }
})
export default router