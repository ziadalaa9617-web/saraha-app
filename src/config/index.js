require('dotenv').config();
const { z } = require('zod');

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default('development'),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  MAILJET_API_KEY: z.string().min(1),
  MAILJET_SECRET_KEY: z.string().min(1),
  MAILJET_SENDER: z.string().email(),
  GOOGLE_CLIENT_ID: z.string().min(1),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
  console.error(`invalid environment variables: ${missing}`);
  process.exit(1);
}

const env = parsed.data;

module.exports = {
  port: env.PORT,
  isProd: env.NODE_ENV === 'production',
  mongoUri: env.MONGO_URI,
  jwtSecret: env.JWT_SECRET,
  mailjet: {
    apiKey: env.MAILJET_API_KEY,
    secretKey: env.MAILJET_SECRET_KEY,
    sender: env.MAILJET_SENDER,
    googleClientId: env.GOOGLE_CLIENT_ID,
  },
};