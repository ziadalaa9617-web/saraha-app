const { isValidObjectId } = require('mongoose');
const AppError = require('../../pkg/AppError');

const createRequestService = ({ requestRepo, messageRepo, conversationRepo }) => {
  const create = async (user, { messageId }) => {
    const message = await messageRepo.findByIdWithSender(messageId);
    if (!message || String(message.receiver) !== String(user._id)) {
      throw new AppError('message not found', 404);
    }
    if (await requestRepo.findByMessage(message._id)) {
      throw new AppError('request already exists', 409);
    }
    const request = await requestRepo.create({
      message: message._id,
      requester: user._id,
      sender: message.sender,
    });
    return { id: request._id, status: request.status };
  };

  const list = (user) => requestRepo.findBySender(user._id);

  const respond = async (user, id, { status }) => {
    if (!isValidObjectId(id)) throw new AppError('invalid id', 400);
    const request = await requestRepo.findById(id);
    if (!request || String(request.sender) !== String(user._id)) {
      throw new AppError('request not found', 404);
    }
    if (request.status !== 'pending') throw new AppError('request already answered', 409);
    await requestRepo.updateStatus(request._id, status);

    if (status === 'accepted') {
      const conversation = await conversationRepo.create({
        message: request.message,
        sender: request.sender,
        receiver: request.requester,
      });
      return { id: request._id, status, conversationId: conversation._id };
    }
    return { id: request._id, status };
  };

  return { create, list, respond };
};

module.exports = createRequestService;