const { messageService } = require('../../factory');
const asyncHandler = require('../../pkg/asyncHandler');

const send = asyncHandler(async (req, res) => {
  const data = await messageService.send(req.user, req.body);
  res.status(201).json({ message: 'message sent', data });
});

const inbox = asyncHandler(async (req, res) => {
  const data = await messageService.inbox(req.user);
  res.json({ data });
});

module.exports = { send, inbox };