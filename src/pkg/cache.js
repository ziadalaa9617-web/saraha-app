const createCache = () => {
  const store = new Map();

  return {
    get: (key) => {
      const item = store.get(key);
      if (!item) return null;
      if (item.expiresAt < Date.now()) {
        store.delete(key);
        return null;
      }
      return item.value;
    },
    set: (key, value, ttlMs) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
    del: (key) => store.delete(key),
    clear: () => store.clear(),
  };
};

module.exports = createCache();