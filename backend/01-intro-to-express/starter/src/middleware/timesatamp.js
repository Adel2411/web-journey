export default function timestamp(req, res, next) {

  const time = new Date().toISOString();
  if (req.method === 'PUT') {
    req.body.updatedAt = time;
  }
  if (req.method === 'POST') {
    req.body.createdAt = time;
    req.body.updatedAt = time;
  }
  next();
}