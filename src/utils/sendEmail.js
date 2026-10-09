const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"NGL App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const subjects = {
  'verify-email': 'Verify your email',
  'reset-password': 'Reset your password',
};

const sendOtpEmail = (to, code, type) =>
  sendEmail({
    to,
    subject: subjects[type],
    html: `<h2>Your OTP is ${code}</h2><p>It expires in 10 minutes.</p>`,
  });

module.exports = { sendEmail, sendOtpEmail };