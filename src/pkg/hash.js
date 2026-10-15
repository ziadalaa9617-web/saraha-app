const bcrypt = require('bcrypt');

module.exports = {
  hash: (value) => bcrypt.hash(value, 10),
  compare: (value, hashed) => bcrypt.compare(value, hashed),
};