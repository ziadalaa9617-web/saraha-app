const { Schema, model, Types } = require('mongoose');

const otpSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['verify-email', 'reset-password', 'enable-2sv', 'login-2sv'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('Otp', otpSchema);