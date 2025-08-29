// middleware/sanitize.js
import xss from "xss";

const DEFAULT_OPTS = {
  whiteList: {}, // by default allow NO tags
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
  maxStringLength: 10000, // optional length limiter
};

const POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function sanitizeValue(val, opts, maxLen) {
  if (val == null) return val;

  if (typeof val === "string") {
    let s = val.trim();
    s = xss(s, opts); // sanitize string
    if (maxLen && s.length > maxLen) s = s.slice(0, maxLen);
    return s;
  }

  if (Array.isArray(val)) {
    return val.map((v) => sanitizeValue(v, opts, maxLen));
  }

  if (val instanceof Date || Buffer.isBuffer(val)) {
    return val; // leave safe objects
  }

  if (typeof val === "object") {
    const out = {};
    for (const key of Object.keys(val)) {
      if (POLLUTION_KEYS.has(key)) continue; // block dangerous keys
      out[key] = sanitizeValue(val[key], opts, maxLen);
    }
    return out;
  }

  return val;
}

export function sanitize(options = {}) {
  const opts = { ...DEFAULT_OPTS, ...options };
  const maxLen = opts.maxStringLength;

  return function sanitizeMiddleware(req, _res, next) {
    try {
      if (req.body && typeof req.body === "object") {
        req.body = sanitizeValue(req.body, opts, maxLen);
      }
      if (req.query && typeof req.query === "object") {
        const clean = sanitizeValue(req.query, opts, maxLen) || {};
        for (const key of Object.keys(req.query)) delete req.query[key];
        for (const [k, v] of Object.entries(clean)) req.query[k] = v;
      }
      if (req.params && typeof req.params === "object") {
        const clean = sanitizeValue(req.params, opts, maxLen) || {};
        for (const key of Object.keys(req.params)) delete req.params[key];
        for (const [k, v] of Object.entries(clean)) req.params[k] = v;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
