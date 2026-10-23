const Conversation = require('./conversation.model');
const ChatMessage = require('./chatMessage.model');

module.exports = {
  create: (data) => Conversation.create(data),
  findById: (id) => Conversation.findById(id),
  findByUser: (user) =>
    Conversation.find({ $or: [{ sender: user }, { receiver: user }] })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('message', 'content')
      .sort({ createdAt: -1 }),
  addMessage: (data) => ChatMessage.create(data),
  findMessages: (conversation) => ChatMessage.find({ conversation }).sort({ createdAt: 1 }),
};