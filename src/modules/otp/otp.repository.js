const Otp = require('./otp.model');

module.exports = {
  deleteByUserAndType: (user, type) => Otp.deleteMany({ user, type }),
  create: (data) => Otp.create(data),
  find: (user, code, type) => Otp.findOne({ user, code, type }),
  deleteById: (id) => Otp.deleteOne({ _id: id }),
};