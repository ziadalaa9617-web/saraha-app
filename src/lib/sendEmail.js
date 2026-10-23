const config = require('../config');

const auth = Buffer.from(`${config.mailjet.apiKey}:${config.mailjet.secretKey}`).toString('base64');

const sendEmail = async ({ to, subject, html }) => {
  const res = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: config.mailjet.sender, Name: 'NGL App' },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`mailjet error ${res.status}: ${await res.text()}`);
};

const subjects = {
  'verify-email': 'Verify your email',
  'reset-password': 'Reset your password',
  'enable-2sv': 'Enable 2-step verification',
'login-2sv': 'Login verification code',
};

const sendOtpEmail = (to, code, type) =>
  sendEmail({
    to,
    subject: subjects[type],
    html: `<h2>Your OTP is ${code}</h2><p>It expires in 10 minutes.</p>`,
  });

module.exports = { sendEmail, sendOtpEmail };