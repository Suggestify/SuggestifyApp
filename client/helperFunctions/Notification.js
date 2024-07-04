const { Expo } = require('expo-server-sdk');
let expo = new Expo();

async function getTokensFromDB() {
    try {
        const { default: UserSettings } = await import('../../server/models/UserSettings.js');
        const userSettings = await UserSettings.find({
            notificationOn: true,
            lastActive: "3",
            notificationToken: { $ne: null }
        }, 'notificationToken');

        console.log("here");
        return userSettings.map(user => user.notificationToken);

    } catch (error) {
        console.error("Error fetching tokens from DB:", error);
        return [];
    }
}

async function sendPushNotifications() {
    let messages = [];
    let somePushTokens = await getTokensFromDB();  // Assume this fetches tokens from your DB

    for (let pushToken of somePushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            body: 'Hello! You have a new notification.',
            data: { withSome: 'data' },
        });
    }

    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {sendPushNotifications};
