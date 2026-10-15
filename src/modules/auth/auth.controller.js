const createAuthService = require('./auth.service');
const userRepo = require('../user/user.repository');
const otpRepo = require('../otp/otp.repository');
const config = require('../../config');
const hasher = require('../../pkg/hash');
const tokens = require('../../pkg/token');
const mailer = require('../../lib/sendEmail');
const generateOtp = require('../../lib/generateOtp');
const googleVerify = require('../../lib/googleVerify');
const asyncHandler = require('../../pkg/asyncHandler');

const authService = createAuthService({
  userRepo,
  otpRepo,
  hasher,
  tokens,
  mailer,
  generateOtp,
  googleVerify,
});

const setTokenCookie = (res, token) =>
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.isProd,
    maxAge: 24 * 60 * 60 * 1000,
  });

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json({ message: 'user created, check your email for the OTP', data });
});

const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  res.json({ message: 'email verified' });
});

const resendOtp = asyncHandler(async (req, res) => {
  await authService.resendOtp(req.body);
  res.json({ message: 'OTP sent' });
});

const login = asyncHandler(async (req, res) => {
  const token = await authService.login(req.body);
  setTokenCookie(res, token);
  res.json({ message: 'logged in' });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.json({ message: 'password updated' });
});

const loginWithGoogle = asyncHandler(async (req, res) => {
  const token = await authService.loginWithGoogle(req.body);
  setTokenCookie(res, token);
  res.json({ message: 'logged in' });
});

module.exports = { register, verifyEmail, resendOtp, login, resetPassword, loginWithGoogle };