const router = require('express').Router();
const validate = require('../../middlewares/validate');
const idempotency = require('../../middlewares/idempotency');
const {
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  resetPasswordSchema,
  googleLoginSchema,
} = require('./auth.validation');
const {
  register,
  verifyEmail,
  resendOtp,
  login,
  resetPassword,
  loginWithGoogle,
} = require('./auth.controller');

router.post('/register', idempotency, validate(registerSchema), register);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.post('/login', validate(loginSchema), login);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/google', validate(googleLoginSchema), loginWithGoogle);

module.exports = router;