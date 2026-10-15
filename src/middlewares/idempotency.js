const cache = require('../pkg/cache');
const AppError = require('../pkg/AppError');

const DAY = 24 * 60 * 60 * 1000;

const idempotency = (req, res, next) => {
  const id = req.get('Idempotency-Key');
  if (!id) return next(new AppError('Idempotency-Key header is required', 400));

  const key = `idem:${req.method}:${req.originalUrl}:${id}`;
  const saved = cache.get(key);

  if (saved === 'pending') return next(new AppError('request is still processing', 409));
  if (saved) {
    res.set('Idempotent-Replayed', 'true');
    return res.status(saved.status).json(saved.body);
  }

  cache.set(key, 'pending', 30000);
  const json = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 500) cache.set(key, { status: res.statusCode, body }, DAY);
    else cache.del(key);
    return json(body);
  };
  next();
};

module.exports = idempotency;