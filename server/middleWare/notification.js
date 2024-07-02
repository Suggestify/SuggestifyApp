import { scheduleJob, RecurrenceRule } from 'node-schedule';
import {client} from "./redisClient.js";

export function scheduleFetchTask() {
    const rule = new RecurrenceRule();
    let userId = "a"
    const key = `user:${userId}:message_count`;
    rule.hour = 21;  // 11 PM
    rule.minute = 31;
    rule.tz = 'America/New_York';  // This ensures it runs at 11:58 PM New York time

    scheduleJob(rule, async () => {
        console.log("HELLO");
        try {
            const value = await client.get(key);
            console.log(`Scheduled task value: ${value}`);
        } catch (error) {
            console.error('Error fetching from Redis:', error);
        }
    });

    console.log("Scheduled task set up for 11:58 PM EST/EDT.");
}
