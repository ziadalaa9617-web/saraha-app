const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
    },
    provider: { type: String, enum: ['google', 'facebook', 'local'], default: 'local' },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    dob: Date,
    gender: { type: String, enum: ['Male', 'Female'] },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);