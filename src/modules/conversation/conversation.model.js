const { Schema, model, Types } = require('mongoose');

const conversationSchema = new Schema(
  {
    message: { type: Types.ObjectId, ref: 'Message', required: true, unique: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = model('Conversation', conversationSchema);