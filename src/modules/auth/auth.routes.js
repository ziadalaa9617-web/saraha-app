const router = require('express').Router();
const validate = require('../../middlewares/validate');
const {
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  resetPasswordSchema,
} = require('./auth.validation');
const { register, verifyEmail, resendOtp, login, resetPassword } = require('./auth.controller');

router.post('/register', validate(registerSchema), register);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.post('/login', validate(loginSchema), login);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;