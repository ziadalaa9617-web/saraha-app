const { z } = require('zod');

const sendMessageSchema = z.object({
  receiverId: z.string().regex(/^[a-f\d]{24}$/i, 'invalid id'),
  content: z.string().trim().min(1).max(1000),
});

module.exports = { sendMessageSchema };