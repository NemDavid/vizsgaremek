const nodemailer = require('nodemailer');
require('dotenv').config();

// SMTP konfiguráció a .env alapján
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT == 465, // 465 = TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Általános email küldő függvény
exports.sendMail = async ({ to, subject, text, html }) => {
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

// Welcome email küldése
exports.sendSimpleNotification = async ({ to, subject, text, html }) => {
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
