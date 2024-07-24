import express from 'express'

import bodyParser from "body-parser";
import User from "../models/User.js";
import dotenv from 'dotenv';
import Stripe from "stripe";
import UserSettings from "../models/UserSettings.js";

dotenv.config();

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET);

import {authenticateToken} from "../middleWare/secureEndPoint.js";

router.use(bodyParser.json());

router.post("/setNotifications", authenticateToken, async (req, res) => {
    const { userName, token } = req.body;

    if (!userName || !token) {
        return res.status(400).json({ message: "Missing userID or token" });
    }

    try {
        const user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userSettings = await UserSettings.findById(user.UserSettingsID);
        if (!userSettings) {
            return res.status(404).json({ message: "User settings not found" });
        }

        userSettings.notificationToken = token;
        await userSettings.save();
        res.status(200).json({ message: "Notification token updated successfully" });
    } catch (error) {
        console.error("Failed to update notification token:", error);
        res.status(500).json({ message: "Failed to update notification token" });
    }
});

router.get("/fetchSettings", async (req, res) => {
    const { userName } = req.query;
    if (!userName) {
        return res.status(400).json({ message: "Missing or invalid userName parameter" });
    }
    try {
        const user = await User.findOne({ userName: userName }).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userSettings = await UserSettings.findById(user.UserSettingsID).lean();
        if (!userSettings) {
            return res.status(404).json({ message: "User settings not found" });
        }

        res.json(userSettings);
    } catch (err) {
        console.error("Error fetching user settings:", err);
        res.status(500).json({ message: "Failed to fetch user settings due to a server error" });
    }
});



router.put("/updateOrder", authenticateToken, async (req, res) => {
    const { userName, newOrder } = req.body;
    if (!userName || !newOrder) {
        return res.status(400).json({ message: "Missing userName or order in request" });
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

        userSettings.mediumOrder = newOrder;
        await userSettings.save();
        res.status(200).json({ message: "User settings updated successfully" });
    } catch (error) {
        console.error("Failed to update user settings:", error); // More detailed error logging might be needed
        res.status(500).json({ message: "Failed to update user settings due to a server error" });
    }
});


router.post("/toggleSwitch", authenticateToken, async (req, res) => {

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



router.post("/paymentIntents", async (req, res) => {
    const  amount  = req.body.amount;
    const  userName  = req.body.userName;

    // Input validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).send({ error: 'Invalid amount provided.' });
    }

    console.log("Received payment request for amount:", amount);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",  // Consider allowing currency to be specified in the request
            automatic_payment_methods: {
                enabled: true,
            }
        });

        let user = await User.findOne({ userName: userName });
        let userSettings = await UserSettings.findById(user.UserSettingsID);
        await userSettings.updateOne({hasPremium: true});

        req.session.user = {userName: userName, hasPremium: true}
        await userSettings.save();


        res.send({ clientSecret: paymentIntent.client_secret }).status(200);

    } catch (err) {
        console.error("Error when creating payment intent:", err);
        res.status(500).send({ error: "An error occurred, please try again later." }); // Generic error message for production
    }
});



export default router