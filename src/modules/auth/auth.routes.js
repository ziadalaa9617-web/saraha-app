const router = require('express').Router();
const validate = require('../../middlewares/validate');
const idempotency = require('../../middlewares/idempotency');
const auth = require('../../middlewares/auth');
const createRateLimiter = require('../../pkg/rateLimiter');

const loginLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 5, prefix: 'login' });
const otpLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 3, prefix: 'otp' });
const {
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  resetPasswordSchema,
  googleLoginSchema,
  codeSchema,
} = require('./auth.validation');
const {
  register,
  verifyEmail,
  resendOtp,
  login,
  resetPassword,
  loginWithGoogle,
  confirmLogin,
  enableTwoStep,
  confirmTwoStep,
} = require('./auth.controller');

router.post('/register', idempotency, validate(registerSchema), register);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/login/confirm', validate(verifyEmailSchema), confirmLogin);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/google', validate(googleLoginSchema), loginWithGoogle);
router.post('/2sv/enable', auth, enableTwoStep);
router.post('/2sv/verify', auth, validate(codeSchema), confirmTwoStep);
router.post('/resend-otp', otpLimiter, validate(resendOtpSchema), resendOtp);

module.exports = router;