import nodemailer from 'nodemailer';
import 'dotenv/config';

console.log('SMTP_HOST =', process.env.SMTP_HOST);
console.log('SMTP_PORT =', process.env.SMTP_PORT);
console.log('SMTP_USER =', process.env.SMTP_USER);
console.log('SMTP_PASS exists =', !!process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('Error connecting to SMTP server:', error);
  } else {
    console.log('SMTP server is ready to take messages');
  }
});

export default transporter;