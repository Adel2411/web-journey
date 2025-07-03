const timestampMiddleware = (req, res, next) => {
 // Timestamp Middleware
  const now = new Date().toISOString();
  if (req.body) {
    if (req.method === 'POST') {
      req.body.createdAt = now;
      req.body.updatedAt = now;
    }
    if (req.method === 'PUT') {
      req.body.updatedAt = now;
    }
  }
  next();
};

export default timestampMiddleware;