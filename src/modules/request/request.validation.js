const { z } = require('zod');

const createRequestSchema = z.object({
  messageId: z.string().regex(/^[a-f\d]{24}$/i, 'invalid id'),
});

const respondSchema = z.object({ status: z.enum(['accepted', 'rejected']) });

module.exports = { createRequestSchema, respondSchema };