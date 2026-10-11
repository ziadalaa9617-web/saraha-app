const AppError = require('../../utils/AppError');

const OTP_TTL = 10 * 60 * 1000;
const OTP_TYPES = ['verify-email', 'reset-password'];

const createAuthService = ({ userRepo, otpRepo, hasher, tokens, mailer, generateOtp }) => {
  const issueOtp = async (user, type) => {
    await otpRepo.deleteByUserAndType(user._id, type);
    const code = generateOtp();
    await otpRepo.create({
      user: user._id,
      code,
      type,
      expiresAt: new Date(Date.now() + OTP_TTL),
    });
    await mailer.sendOtpEmail(user.email, code, type);
  };

  const checkOtp = async (userId, code, type) => {
    const otp = await otpRepo.find(userId, code, type);
    if (!otp || otp.expiresAt < new Date()) throw new AppError('invalid or expired OTP', 400);
    return otp;
  };

  const register = async ({ name, email, password, dob, gender }) => {
    if (await userRepo.findByEmail(email)) throw new AppError('email already exists', 409);
    const user = await userRepo.create({
      name,
      email,
      password: await hasher.hash(password),
      dob,
      gender,
    });
    await issueOtp(user, 'verify-email');
    return { id: user._id, name: user.name, email: user.email };
  };

  const verifyEmail = async ({ email, code }) => {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('user not found', 404);
    if (user.isVerified) throw new AppError('already verified', 400);
    const otp = await checkOtp(user._id, code, 'verify-email');
    await userRepo.updateById(user._id, { isVerified: true });
    await otpRepo.deleteById(otp._id);
  };

  const resendOtp = async ({ email, type }) => {
    if (!OTP_TYPES.includes(type)) throw new AppError('invalid type', 400);
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('user not found', 404);
    if (type === 'verify-email' && user.isVerified) throw new AppError('already verified', 400);
    await issueOtp(user, type);
  };

  const login = async ({ email, password }) => {
    const user = await userRepo.findByEmail(email);
    const match =
      user && !user.isDeleted && user.password && (await hasher.compare(password, user.password));
    if (!match) throw new AppError('invalid email or password', 401);
    if (!user.isVerified) throw new AppError('verify your email first', 403);
    return tokens.sign({ id: user._id });
  };

  const resetPassword = async ({ email, code, newPassword }) => {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('user not found', 404);
    const otp = await checkOtp(user._id, code, 'reset-password');
    await userRepo.updateById(user._id, { password: await hasher.hash(newPassword) });
    await otpRepo.deleteById(otp._id);
  };

  return { register, verifyEmail, resendOtp, login, resetPassword };
};

module.exports = createAuthService;