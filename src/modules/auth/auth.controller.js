const bcrypt = require('bcrypt');
const User = require('../user/user.model');
const Otp = require('../otp/otp.model');
const generateOtp = require('../../utils/generateOtp');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../../utils/sendEmail');
const register = async (req, res) => {
  const { name, email, password, dob, gender } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, dob, gender });

  const code = generateOtp();
  await Otp.create({
    user: user._id,
    code,
    type: 'verify-email',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(email, code, 'verify-email');

  res.status(201).json({
    message: 'user created, check your email for the OTP',
    data: { id: user._id, name: user.name, email: user.email },
  });
};
const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'user not found' });
  if (user.isVerified) return res.status(400).json({ message: 'already verified' });

  const otp = await Otp.findOne({ user: user._id, code, type: 'verify-email' });
  if (!otp || otp.expiresAt < new Date()) {
    return res.status(400).json({ message: 'invalid or expired OTP' });
  }

  user.isVerified = true;
  await user.save();
  await otp.deleteOne();

  res.json({ message: 'email verified' });
};
const resendOtp = async (req, res) => {
  const { email, type } = req.body;

  if (!['verify-email', 'reset-password'].includes(type)) {
    return res.status(400).json({ message: 'invalid type' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'user not found' });
  if (type === 'verify-email' && user.isVerified) {
    return res.status(400).json({ message: 'already verified' });
  }

  await Otp.deleteMany({ user: user._id, type });

  const code = generateOtp();
  await Otp.create({
    user: user._id,
    code,
    type,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(email, code, type);

  res.json({ message: 'OTP sent' });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isDeleted: false });
  const match = user?.password && (await bcrypt.compare(password, user.password));
  if (!match) return res.status(401).json({ message: 'invalid email or password' });

  if (!user.isVerified) return res.status(403).json({ message: 'verify your email first' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: 'logged in' });
};
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'user not found' });

  const otp = await Otp.findOne({ user: user._id, code, type: 'reset-password' });
  if (!otp || otp.expiresAt < new Date()) {
    return res.status(400).json({ message: 'invalid or expired OTP' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await otp.deleteOne();

  res.json({ message: 'password updated' });
};

module.exports = { register, verifyEmail, resendOtp, login, resetPassword };