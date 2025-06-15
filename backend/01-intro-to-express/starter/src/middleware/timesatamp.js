
const addTimestamps = (req, res, next) => {
  const now = new Date().toISOString();

  // si our method is post
  if (req.method === "POST") {
    req.body.createdAt = now;
    req.body.updatedAt = now;
  }

   // si our method is put
  if (req.method === "PUT") {
    req.body.updatedAt = now;
  }

  next();
};

export default addTimestamps;

/**Ajoute les dates createdAt / updatedAt */