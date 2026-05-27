import express from 'express';
import { mailQueue } from './queue.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-email', async (req, res) => {
  const { to, subject, body } = req.body;
  await mailQueue.add('sendEmail', { to, subject, body });
  res.send('Email job has been added to the queue');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});