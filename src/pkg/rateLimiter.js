const AppError = require('./AppError');
const defaultCache = require('./cache');

const createRateLimiter = ({ windowMs, max, prefix = 'rl', cache = defaultCache }) => (req, res, next) => {
  
  const key = `${prefix}:${req.ip}`;
  const entry = cache.get(key) || { count: 0, resetAt: Date.now() + windowMs };
  entry.count++;
  cache.set(key, entry, entry.resetAt - Date.now());

  if (entry.count > max) {
    res.set('Retry-After', Math.ceil((entry.resetAt - Date.now()) / 1000));
    return next(new AppError('too many requests, try again later', 429));
  }
  next();
};

module.exports = createRateLimiter;