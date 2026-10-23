const createMessageService = require('./message.service');
const messageRepo = require('./message.repository');
const userRepo = require('../user/user.repository');
const asyncHandler = require('../../pkg/asyncHandler');

const messageService = createMessageService({ messageRepo, userRepo });

const send = asyncHandler(async (req, res) => {
  const data = await messageService.send(req.user, req.body);
  res.status(201).json({ message: 'message sent', data });
});

const inbox = asyncHandler(async (req, res) => {
  const data = await messageService.inbox(req.user);
  res.json({ data });
});

module.exports = { send, inbox };