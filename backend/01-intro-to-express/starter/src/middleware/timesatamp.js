export default function timestamp(req, res, next) {
  const timeNow = new Date().toISOString();

  if (req.method === "POST") {
    req.body.createdAt = timeNow;
    req.body.updatedAt = timeNow;
  }

  if (req.method === "PUT") {
    req.body.updatedAt = timeNow;
  }

  next();
}
