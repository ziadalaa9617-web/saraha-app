const AppError = require('../../pkg/AppError');

const OTP_TTL = 10 * 60 * 1000;
const OTP_TYPES = ['verify-email', 'reset-password'];
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000;

const createAuthService = ({ userRepo, otpRepo, hasher, tokens, mailer, generateOtp, googleVerify }) => {
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
    if (!user || user.isDeleted || !user.password) throw new AppError('invalid email or password', 401);
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError('account temporarily banned, try again later', 429);
    }

    if (!(await hasher.compare(password, user.password))) {
      const attempts = user.failedAttempts + 1;
      await userRepo.updateById(
        user._id,
        attempts >= MAX_ATTEMPTS
          ? { failedAttempts: 0, lockUntil: new Date(Date.now() + LOCK_TIME) }
          : { failedAttempts: attempts }
      );
      throw new AppError('invalid email or password', 401);
    }

    if (!user.isVerified) throw new AppError('verify your email first', 403);
    if (user.failedAttempts || user.lockUntil) {
      await userRepo.updateById(user._id, { failedAttempts: 0, lockUntil: null });
    }

    if (user.twoStepEnabled) {
      await issueOtp(user, 'login-2sv');
      return { twoStep: true };
    }
    return { token: tokens.sign({ id: user._id }) };
  };

  const resetPassword = async ({ email, code, newPassword }) => {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('user not found', 404);
    const otp = await checkOtp(user._id, code, 'reset-password');
    await userRepo.updateById(user._id, { password: await hasher.hash(newPassword) });
    await otpRepo.deleteById(otp._id);
  };

  const loginWithGoogle = async ({ idToken }) => {
    let info;
    try {
      info = await googleVerify(idToken);
    } catch {
      throw new AppError('invalid google token', 401);
    }
    if (!info.emailVerified) throw new AppError('google email not verified', 401);

    let user = await userRepo.findByEmail(info.email);
    if (user?.isDeleted) throw new AppError('account is deleted', 403);
    if (!user) {
      user = await userRepo.create({
        name: info.name.slice(0, 20),
        email: info.email,
        provider: 'google',
        isVerified: true,
      });
    }
    return tokens.sign({ id: user._id });
  };

  const enableTwoStep = async (user) => {
    if (user.twoStepEnabled) throw new AppError('already enabled', 400);
    await issueOtp(user, 'enable-2sv');
  };

  const confirmTwoStep = async (user, { code }) => {
    const otp = await checkOtp(user._id, code, 'enable-2sv');
    await userRepo.updateById(user._id, { twoStepEnabled: true });
    await otpRepo.deleteById(otp._id);
  };

  const confirmLogin = async ({ email, code }) => {
    const user = await userRepo.findByEmail(email);
    if (!user || user.isDeleted) throw new AppError('invalid or expired OTP', 400);
    const otp = await checkOtp(user._id, code, 'login-2sv');
    await otpRepo.deleteById(otp._id);
    return tokens.sign({ id: user._id });
  };

  return {
    register,
    verifyEmail,
    resendOtp,
    login,
    resetPassword,
    loginWithGoogle,
    enableTwoStep,
    confirmTwoStep,
    confirmLogin,
  };
};

module.exports = createAuthService;