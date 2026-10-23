const User = require('./user.model');

module.exports = {
  findByEmail: (email) => User.findOne({ email }),
  create: (data) => User.create(data),
  updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true }),
  findById: (id) => User.findById(id),
};