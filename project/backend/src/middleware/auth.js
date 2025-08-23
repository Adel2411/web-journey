import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  // Get token from headers
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Bearer TOKEN
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Verify token with secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = {
  id: decoded.userId,
  email: decoded.email
};
    next(); // continue to next middleware/route
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
