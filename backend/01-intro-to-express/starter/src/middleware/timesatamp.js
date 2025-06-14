export default function timestamp(req, res, next) {
  if (req.method === 'POST') {
    req.body.createdAt = new Date().toISOString();;
  }
  next();
}