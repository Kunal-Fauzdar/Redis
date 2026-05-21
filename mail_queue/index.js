import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis("redis://localhost:6379");

const queueKey = 'mail:queue';

app.post('/mail/send', async (req, res) => {
    const { to, subject, body } = req.body;
    const mailData = JSON.stringify({ to, subject, body });
    await redis.lpush(queueKey, mailData);
    res.json({ message: 'Mail queued' });
});

app.get('/mail/queue', async (req, res) => {
    const mailData = await redis.rpop(queueKey);
    res.json({ mailData: mailData ? JSON.parse(mailData) : null });
});

app.listen(3000, () => {
    console.log('Mail queue service running on port 3000');
});