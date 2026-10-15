const { getCorrelationId } = require('../middlewares/correlationId');

const log = (level, message) =>
  console[level](`[${new Date().toISOString()}] [${getCorrelationId() || '-'}] ${message}`);

module.exports = {
  info: (m) => log('log', m),
  error: (m) => log('error', m),
};