const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: 'User', required: true, select: false },
    receiver: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = model('Message', messageSchema);