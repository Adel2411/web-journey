import rateLimit from "express-rate-limit";

export function createRateLimiter({ windowMs, max, keyPrefix = "", message }) {
  return rateLimit({
    windowMs,
    max,
    legacyHeaders: false, // disable deprecated headers
    standardHeaders: true, // return rate limit info in standard headers

    keyGenerator: (req) => {
      // Safely get IP address
      let ip;

      if (req.headers["x-forwarded-for"]) {
        const forwarded = req.headers["x-forwarded-for"];
        ip = Array.isArray(forwarded)
          ? forwarded[0]
          : forwarded.split(",")[0].trim();
      } else {
        ip = req.ip; // fallback
      }

      // Optional: make rate limit route-specific
      const routeKey = `${req.method}:${req.baseUrl}${req.path}`;

      return `${keyPrefix}${ip}:${routeKey}`;
    },

    message: {
      error: message || "Too many requests. Please try again later.",
    },
  });
}
