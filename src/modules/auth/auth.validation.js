const { z } = require('zod');

const email = z.string().trim().toLowerCase().email();
const code = z.string().regex(/^\d{6}$/, 'must be 6 digits');
const type = z.enum(['verify-email', 'reset-password']);

const registerSchema = z.object({
  name: z.string().trim().min(3).max(20),
  email,
  password: z.string().min(6),
  dob: z.coerce.date().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
});
const codeSchema = z.object({ code });
const verifyEmailSchema = z.object({ email, code });

const resendOtpSchema = z.object({ email, type });

const loginSchema = z.object({ email, password: z.string().min(1) });

const resetPasswordSchema = z.object({
  email,
  code,
  newPassword: z.string().min(6),
});

const googleLoginSchema = z.object({ idToken: z.string().min(1) });

module.exports = {
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  resetPasswordSchema,
  googleLoginSchema,
  codeSchema,
};