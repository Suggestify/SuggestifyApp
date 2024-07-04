import pkg from 'redis';

const { createClient } = pkg;

const client = createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();


export {client};
