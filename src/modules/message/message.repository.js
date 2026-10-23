const Message = require('./message.model');

module.exports = {
  create: (data) => Message.create(data),
  findByReceiver: (receiver) => Message.find({ receiver }).sort({ createdAt: -1 }),
  findByIdWithSender: (id) => Message.findById(id).select('+sender'),
  findById: (id) => Message.findById(id),
};