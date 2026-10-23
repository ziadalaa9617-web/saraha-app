const Request = require('./request.model');

module.exports = {
  create: (data) => Request.create(data),
  findByMessage: (message) => Request.findOne({ message }),
  findById: (id) => Request.findById(id).select('+sender'),
  findBySender: (sender) =>
    Request.find({ sender })
      .populate('requester', 'name')
      .populate('message', 'content')
      .sort({ createdAt: -1 }),
  updateStatus: (id, status) => Request.findByIdAndUpdate(id, { status }),
};