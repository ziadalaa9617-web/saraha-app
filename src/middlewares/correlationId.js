const crypto = require('crypto');
const { AsyncLocalStorage } = require('async_hooks');

const storage = new AsyncLocalStorage();

const correlationId = (req, res, next) => {
  const id = req.get('X-Correlation-Id') || crypto.randomUUID();
  req.correlationId = id;
  res.set('X-Correlation-Id', id);
  storage.run({ id }, next);
};

const getCorrelationId = () => storage.getStore()?.id;

module.exports = { correlationId, getCorrelationId };