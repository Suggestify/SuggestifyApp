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
        console.log("User found");
        user.notificationToken = token; // Directly assign the token to the user model
        await user.save(); // Save the updated user to the database

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
        try{
            let userSettings = await UserSettings.findById(user.UserSettingsID);
            if (!userSettings) {
                return res.status(404).send({message: "User settings not found"});
            }
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

export default router