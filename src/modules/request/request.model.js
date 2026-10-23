const { Schema, model, Types } = require('mongoose');

const requestSchema = new Schema(
  {
    message: { type: Types.ObjectId, ref: 'Message', required: true, unique: true },
    requester: { type: Types.ObjectId, ref: 'User', required: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true, select: false },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = model('Request', requestSchema);