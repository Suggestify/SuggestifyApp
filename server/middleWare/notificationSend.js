import { scheduleJob, RecurrenceRule } from 'node-schedule';
import {sendPushNotifications} from "../../client/helperFunctions/Notification.js";

export function checkNotifications() {
    const rule = new RecurrenceRule();
    rule.hour = 18;  // at 1pm for now?
    rule.minute = 53;
    rule.tz = 'America/New_York';

    scheduleJob(rule, async () => {
        console.log("HELLO");
        await sendPushNotifications();

    });
}

