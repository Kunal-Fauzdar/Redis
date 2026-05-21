import Redis from 'ioredis';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const redis = new Redis("redis://localhost:6379");

const generateOTPKey = (phone) => {
    return `otp:${phone}`;
};

app.post('/otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = generateOTPKey(phone);
    await redis.set(otpKey, otp, 'EX', 30); // OTP expires in 30 seconds    
    res.json({ message: 'OTP sent' , otp });
});

app.post('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body;
    const otpKey = generateOTPKey(phone);
    const storedOtp = await redis.get(otpKey);
    if(!storedOtp){
        return res.status(400).json({ message: 'OTP expired or not found' });
    }
    if (storedOtp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (storedOtp === otp) {
        await redis.del(otpKey); 
        res.json({ message: 'OTP verified successfully' });
    }
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const { phone } = req.params;
    const otpKey = generateOTPKey(phone);
    const ttl = await redis.ttl(otpKey);
    res.json({ ttl });
});

app.listen(3000, () => {
    console.log('OTP service is running on port 3000');
});
