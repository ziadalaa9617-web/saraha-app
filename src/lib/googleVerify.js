const { OAuth2Client } = require('google-auth-library');
const config = require('../config');

const client = new OAuth2Client(config.googleClientId);

const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({ idToken, audience: config.googleClientId });
  const { email, name, email_verified } = ticket.getPayload();
  return { email, name, emailVerified: email_verified };
};

module.exports = verifyGoogleToken;