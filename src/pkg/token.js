const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  sign: (payload) => jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' }),
  verify: (token) => jwt.verify(token, config.jwtSecret),
};