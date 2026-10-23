const AppError = require('../../pkg/AppError');

const createMessageService = ({ messageRepo, userRepo }) => {
  const send = async (user, { receiverId, content }) => {
    if (String(user._id) === receiverId) throw new AppError('you cannot message yourself', 400);
    const receiver = await userRepo.findById(receiverId);
    if (!receiver || receiver.isDeleted) throw new AppError('receiver not found', 404);
    const message = await messageRepo.create({ sender: user._id, receiver: receiver._id, content });
    return { id: message._id };
  };

  const inbox = (user) => messageRepo.findByReceiver(user._id);

  return { send, inbox };
};

module.exports = createMessageService;