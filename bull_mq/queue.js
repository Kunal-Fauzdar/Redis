import Redis from 'ioredis';
import { Queue } from 'bullmq';

export const connection = new Redis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const mailQueue = new Queue('emailQueue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    attempts: 3,
  },
});