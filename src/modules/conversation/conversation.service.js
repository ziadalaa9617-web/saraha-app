const { isValidObjectId } = require('mongoose');
const AppError = require('../../pkg/AppError');

const createConversationService = ({ conversationRepo }) => {
  const getOwn = async (user, id) => {
    if (!isValidObjectId(id)) throw new AppError('invalid id', 400);
    const conversation = await conversationRepo.findById(id);
    const isMember =
      conversation &&
      [conversation.sender, conversation.receiver].some((u) => String(u) === String(user._id));
    if (!isMember) throw new AppError('conversation not found', 404);
    return conversation;
  };

  const list = (user) => conversationRepo.findByUser(user._id);

  const send = async (user, id, { content }) => {
    const conversation = await getOwn(user, id);
    const msg = await conversationRepo.addMessage({
      conversation: conversation._id,
      sender: user._id,
      content,
    });
    return { id: msg._id };
  };

  const messages = async (user, id) => {
    const conversation = await getOwn(user, id);
    return conversationRepo.findMessages(conversation._id);
  };

  return { list, send, messages };
};

module.exports = createConversationService;