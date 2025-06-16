const autoTimestamps = (req, res, next) => {
  const timestamp = new Date().toISOString();

  if (req.method === "POST") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("Request body is missing.");
    }
    req.body.createdAt = timestamp;
    req.body.updatedAt = timestamp;
  }

  if (req.method === "PUT") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("Request body is missing.");
    }
    req.body.updatedAt = timestamp;
  }

  next();
};

export default autoTimestamps;
