const createConversationService = require('./conversation.service');
const conversationRepo = require('./conversation.repository');
const asyncHandler = require('../../pkg/asyncHandler');

const service = createConversationService({ conversationRepo });

const list = asyncHandler(async (req, res) => {
  res.json({ data: await service.list(req.user) });
});

const send = asyncHandler(async (req, res) => {
  const data = await service.send(req.user, req.params.id, req.body);
  res.status(201).json({ message: 'message sent', data });
});

const messages = asyncHandler(async (req, res) => {
  res.json({ data: await service.messages(req.user, req.params.id) });
});

module.exports = { list, send, messages };