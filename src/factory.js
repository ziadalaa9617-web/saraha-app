const userRepo = require('./modules/user/user.repository');
const otpRepo = require('./modules/otp/otp.repository');
const messageRepo = require('./modules/message/message.repository');
const requestRepo = require('./modules/request/request.repository');
const conversationRepo = require('./modules/conversation/conversation.repository');

const hasher = require('./pkg/hash');
const tokens = require('./pkg/token');
const cache = require('./pkg/cache');
const mailer = require('./lib/sendEmail');
const generateOtp = require('./lib/generateOtp');
const googleVerify = require('./lib/googleVerify');

const createAuthService = require('./modules/auth/auth.service');
const createUserService = require('./modules/user/user.service');
const createMessageService = require('./modules/message/message.service');
const createRequestService = require('./modules/request/request.service');
const createConversationService = require('./modules/conversation/conversation.service');

module.exports = {
  authService: createAuthService({
    userRepo, otpRepo, hasher, tokens, mailer, generateOtp, googleVerify, cache,
  }),
  userService: createUserService({ userRepo }),
  messageService: createMessageService({ messageRepo, userRepo }),
  requestService: createRequestService({ requestRepo, messageRepo, conversationRepo }),
  conversationService: createConversationService({ conversationRepo }),
};