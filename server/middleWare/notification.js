import { scheduleJob, RecurrenceRule } from 'node-schedule';
import {client} from "./redisClient.js";
import User from "../models/User.js";
import UserSettings from "../models/UserSettings.js";

// remame file
export async function scheduleFetchTask() {
    const rule = new RecurrenceRule();
    let users = await User.find();
    let userNames = users.map(user => user.userName);
    console.log(userNames);
    rule.hour = 18;  // 11 PM
    rule.minute = 47;
    rule.tz = 'America/New_York';

    scheduleJob(rule, async () => {
        console.log("HELLO");
        try {
            for (let userName of userNames) {
                let userId = userName  // req.session
                const key = `user:${userId}:message_count`;

                const value = await client.get(key);
                console.log(`Scheduled task value: ${value}`);
                if (value === "null") {  // put in try and catch
                    let curUser = await User.findOne({userName: userId});
                    let userSettings = await UserSettings.findById(curUser.UserSettingsID);
                    userSettings.lastActive += 1;
                    await userSettings.save();
                }
            }
        } catch (error) {
            console.error('Error fetching from Redis:', error);
        }
    });

    console.log("Scheduled task set up for 11:58 PM EST/EDT.");
}
