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
    const { userName, token } = req.body;

    if (!userName || !token) {
        return res.status(400).send({ message: "Missing userID or token" });
    }
    try {
        let user = await User.findOne({ userName: userName});
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).send({ message: "User settings not found" });
        }

        userSettings.notificationToken = token; // Directly assign the token to the user model
        try {
            await userSettings.save();
            res.status(200).json({ message: "Notification token updated successfully" });
        } catch (saveError) {
            res.status(500).send({ message: "Failed to save notification token" });
        }
    } catch (err) {
        res.status(500).send({ message: "Failed to update notification token" });
    }
});

router.get("/fetchSettings", async (req, res) => {
    const userName = req.query.userName;
    if (!userName) {
        return res.status(400).send({ message: "Missing or invalid userName parameter" });
    }

    try {
        let user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).send({ message: "User settings not found" });
        }

        res.status(200).json(userSettings);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch user settings due to a server error" });
    }
});


router.put("/updateOrder", async (req, res) => {
    const { userName, newOrder } = req.body;
    // Validate inputs
    if (!userName || !newOrder) {
        return res.status(400).send({ message: "Missing userName or order in request" });
    }
    try {
        // Fetch user and their settings
        let user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).send({ message: "User settings not found" });
        }

        // Update and save user settings
        userSettings.mediumOrder = newOrder;
        await userSettings.save();

        res.status(200).send({ message: "User settings updated successfully" });
    } catch (err) {
        console.error(err); // Consider more secure logging strategies
        res.status(500).send({ message: "Failed to update user settings due to a server error" });
    }
});

router.post("/toggleSwitch", async (req, res) => {
    const { userName, switchType, value } = req.body;
    // Validate inputs
    if (!userName || switchType === undefined || value === undefined) {
        return res.status(400).send({ message: "Missing required fields (userName, switchType, or switchState)" });
    }
    // Validate switchType to ensure it's a known property
    const validSwitchTypes = ['notificationOn', 'theme']; // example switch types
    if (!validSwitchTypes.includes(switchType)) {
        return res.status(400).send({ message: "Invalid switchType provided" });
    }
    try {
        let user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).send({ message: "User settings not found" });
        }
        userSettings[switchType] = value;
        await userSettings.save();

        if (switchType === "notificationOn" && value && userSettings.notificationToken === undefined) {
            return res.status(200).send({ message: "Notification enabled", firstTime: true });
        }
        res.status(200).send({ message: "Switch toggled successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to toggle switch due to a server error" });
    }
});

export default router