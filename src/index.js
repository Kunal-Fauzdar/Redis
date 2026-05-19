import Redis from 'ioredis';
import express from 'express';
const app = express();
import mongoose from 'mongoose';

const redis = new Redis("redis://localhost:6379");

app.get('/redis', async (req, res) => {
    const value = await redis.ping();
    res.json({ redis: value });
});

app.get('/mongo', async (req, res) => {
    if(mongoose.connection.readyState === 0) {
        mongoose.connect('mongodb://localhost:27017/redis-learning');
    }

    res.json({ mongo: 'connected' , database: mongoose.connection.name });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});