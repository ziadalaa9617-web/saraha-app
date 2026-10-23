const { Schema, model, Types } = require('mongoose');

const chatMessageSchema = new Schema(
  {
    conversation: { type: Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = model('ChatMessage', chatMessageSchema);