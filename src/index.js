import Redis from 'ioredis';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

const bannerKey = 'app:banner';

app.post('/redis/banner', async (req, res) => {
    const { message } = req.body;
    await redis.set(bannerKey, message || 'Welcome to our application!');
    res.json({ message: 'Banner updated' });
});

app.get('/redis/banner', async (req, res) => {
    const message = await redis.get(bannerKey);
    res.json({ message });
});

app.get('/redis/banner/exists' , async(req,res)=>{
    const exists = await redis.exists(bannerKey);
    res.json({ exists: Boolean(exists) });
});

app.delete('/redis/banner', async (req, res) => {
    await redis.del(bannerKey);
    res.json({ message: 'Banner deleted' });
});

app.post('/redis/:id', async (req, res) => {
    const { id } = req.params;
    await redis.hset(`key:${id}`, req.body);
    res.json({ message: 'Value updated' });
});

app.get('/redis/:id', async (req, res) => {
    const { id } = req.params;
    const value = await redis.hgetall(`key:${id}`);
    res.json({ value });
});

app.get('/redis/:id/:field/exists', async (req, res) => {
    const { id, field } = req.params;
    const exists = await redis.hexists(`key:${id}`, field);
    res.json({ exists: Boolean(exists) });
}); 

app.delete('/redis/:id/:field', async (req, res) => {
    const { id, field } = req.params;
    await redis.hdel(`key:${id}`, field);
    res.json({ message: 'Value deleted' });
});

app.get('/redis/:id/:field', async (req, res) => {
    const { id, field } = req.params;
    const value = await redis.hget(`key:${id}`, field);
    res.json({ value });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});