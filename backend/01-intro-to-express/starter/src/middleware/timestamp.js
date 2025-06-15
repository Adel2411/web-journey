export default function timestamp(req, res, next) {
  const Timestamp = new Date().toISOString();

  // POST: set both createdAt and updatedAt
  if (req.method === 'POST') {
    req.body.createdAt = Timestamp;
    req.body.updatedAt = Timestamp;
  }

  // PUT: update only updatedAt
  if (req.method === 'PUT') {
    req.body.updatedAt = Timestamp;
  }

  next();
}