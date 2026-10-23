const { z } = require('zod');

const sendSchema = z.object({ content: z.string().trim().min(1).max(1000) });

module.exports = { sendSchema };