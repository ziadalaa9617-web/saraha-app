const cache = require('../pkg/cache');

const withCache = (ttlMs = 60000, keyFn = (req) => req.originalUrl) => (req, res, next) => {
  const key = `${req.method}:${keyFn(req)}`;
  const hit = cache.get(key);
  if (hit) {
    res.set('X-Cache', 'HIT');
    return res.status(hit.status).json(hit.body);
  }

  res.set('X-Cache', 'MISS');
  const json = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 400) cache.set(key, { status: res.statusCode, body }, ttlMs);
    return json(body);
  };
  next();
};

module.exports = withCache;