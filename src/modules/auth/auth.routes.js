const router = require('express').Router();
const { register, verifyEmail, resendOtp, login, resetPassword } = require('./auth.controller');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/reset-password', resetPassword);

module.exports = router;