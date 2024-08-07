import {client} from './redisClient.js';
import moment from 'moment-timezone';

let limit = 10;


const rateLimit = async (req, res, next) => {
    console.log(req.session.user);

    console.log(limit);
    const userId = req.body.userName || 'default_user';
    const key = `user:${userId}:message_count`;

    if(req.session.user){
        if (req.session.user.hasPremium === true) {
            limit = 30;
        }
    }

    try {
        const currentCount = await client.get(key); // Get the current count first

        console.log(limit);
        if (currentCount !== null && parseInt(currentCount) >= limit) {
            console.log("Rate limit exceeded");
            return res.status(429).send('Rate limit exceeded');
        }

        const incrementedCount = await client.incr(key);
        console.log('Current count:', incrementedCount);

        if (incrementedCount === 1) { // If this is the first message of the day, set expiration to midnight EST
            const now = moment().tz("America/New_York");
            const midnight = now.clone().add(1, 'days').startOf('day');
            const secondsUntilMidnight = midnight.diff(now, 'seconds');
            const expireSuccess = await client.expire(key, secondsUntilMidnight);
            if (!expireSuccess) {
                throw new Error(`Failed to set expiration on key: ${key}`);
            }
        }

        next();
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).send('Internal Server Error');
    }
};

export default rateLimit;
