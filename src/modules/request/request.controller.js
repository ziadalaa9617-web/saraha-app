const createRequestService = require('./request.service');
const requestRepo = require('./request.repository');
const messageRepo = require('../message/message.repository');
const conversationRepo = require('../conversation/conversation.repository');
const asyncHandler = require('../../pkg/asyncHandler');

const requestService = createRequestService({ requestRepo, messageRepo, conversationRepo });

const create = asyncHandler(async (req, res) => {
  const data = await requestService.create(req.user, req.body);
  res.status(201).json({ message: 'request sent', data });
});

const list = asyncHandler(async (req, res) => {
  const data = await requestService.list(req.user);
  res.json({ data });
});

const respond = asyncHandler(async (req, res) => {
  const data = await requestService.respond(req.user, req.params.id, req.body);
  res.json({ message: `request ${data.status}`, data });
});

module.exports = { create, list, respond };