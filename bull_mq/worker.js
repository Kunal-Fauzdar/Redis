import 'dotenv/config';
import { Worker } from 'bullmq';
import { connection } from './queue.js';
import transporter from './transporter.js';

console.log('Worker is starting...');

const processEmailJob = async (job) => {
  const { to, subject, body } = job.data;

  console.log(`📧 Processing job [${job.id}] → Sending to ${to}`);
  await job.updateProgress(10);

  const info = await transporter.sendMail({
    from: `"Example Team" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: body,
  });

  console.log(`Email sent: ${info.messageId}`);
  await job.updateProgress(100);
};

const worker = new Worker('emailQueue', processEmailJob, {
  connection,
});

worker.on('progress', (job, progress) => {
  console.log(`⏳ Job ${job.id} progress: ${progress}%`);
});

worker.on('completed', (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Job with id ${job?.id} has failed with error ${err.message}`);
});