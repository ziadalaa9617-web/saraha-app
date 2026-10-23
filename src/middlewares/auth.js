const AppError = require('../pkg/AppError');
const asyncHandler = require('../pkg/asyncHandler');
const tokens = require('../pkg/token');
const userRepo = require('../modules/user/user.repository');

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw new AppError('unauthorized', 401);

  let payload;
  try {
    payload = tokens.verify(token);
  } catch {
    throw new AppError('unauthorized', 401);
  }

  const user = await userRepo.findById(payload.id);
  if (!user || user.isDeleted) throw new AppError('unauthorized', 401);

  req.user = user;
  next();
});

module.exports = auth;