const stores = new Map();

export function createRateLimiter({ windowMs = 60000, max = 60, name = "default", statusCode = 429 }) {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  const store = stores.get(name);

  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store) {
      if (now - record.windowStart > windowMs) {
        store.delete(key);
      }
    }
  }, windowMs * 2);

  if (interval.unref) interval.unref();

  return function rateLimit(req, res) {
    let key = "unknown";
    if (req?.ip) {
      key = String(req.ip);
    } else if (typeof req?.headers?.["x-forwarded-for"] === "string" && req.headers["x-forwarded-for"].trim()) {
      key = req.headers["x-forwarded-for"].split(",")[0].trim();
    } else if (req?.socket?.remoteAddress) {
      key = String(req.socket.remoteAddress);
    }

    const now = Date.now();
    let record = store.get(key);
    if (!record || now - record.windowStart > windowMs) {
      record = { count: 1, windowStart: now };
      store.set(key, record);
    } else {
      record.count += 1;
    }
    const remaining = Math.max(0, max - record.count);
    const resetMs = windowMs - (now - record.windowStart);
    if (res && typeof res.setHeader === "function") {
      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader("X-RateLimit-Remaining", String(remaining));
      res.setHeader("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000)));
      if (record.count > max) {
        res.setHeader("Retry-After", String(Math.ceil(resetMs / 1000)));
      }
    }
    if (record.count > max) {
      return { limited: true, statusCode };
    }
    return { limited: false };
  };
}
