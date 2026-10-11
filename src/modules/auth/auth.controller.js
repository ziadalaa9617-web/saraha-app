const createAuthService = require('./auth.service');
const userRepo = require('../user/user.repository');
const otpRepo = require('../otp/otp.repository');
const hasher = require('../../utils/hash');
const tokens = require('../../utils/token');
const mailer = require('../../utils/sendEmail');
const generateOtp = require('../../utils/generateOtp');
const asyncHandler = require('../../utils/asyncHandler');

const authService = createAuthService({ userRepo, otpRepo, hasher, tokens, mailer, generateOtp });

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
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ message: 'logged in' });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.json({ message: 'password updated' });
});

module.exports = { register, verifyEmail, resendOtp, login, resetPassword };