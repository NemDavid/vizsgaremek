const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  // Dev módban csak logoljuk
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV EMAIL] to: ${to}, subject: ${subject}`);
    console.log('Text:', text);
    console.log('HTML:', html);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('Email sending error:', err);
    throw err;
  }
};



