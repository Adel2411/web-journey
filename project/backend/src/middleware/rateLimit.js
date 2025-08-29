import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export function createRateLimiter({ windowMs, max, keyPrefix = "", message }) {
  return rateLimit({
    windowMs,
    max,
    legacyHeaders: false, // disable deprecated headers
    standardHeaders: true, // return rate limit info in standard headers

    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req);
      const routeKey = `${req.method}:${req.baseUrl}${req.path}`;
      return `${keyPrefix}${ip}:${routeKey}`;
    },

    message: {
      error: message || "Too many requests. Please try again later.",
    },
  });
}
