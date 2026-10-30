const createUserService = require('./user.service');
const userRepo = require('./user.repository');
const asyncHandler = require('../../pkg/asyncHandler');

const userService = createUserService({ userRepo });

const uploadAvatar = asyncHandler(async (req, res) => {
  const data = await userService.uploadAvatar(req.user, req.file);
  res.json({ message: 'avatar updated', data });
});

module.exports = { uploadAvatar };