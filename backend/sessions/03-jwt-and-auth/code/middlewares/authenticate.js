import { verifyJWT } from "../utils/jwt.js";

// Middleware to check if user is authenticated
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized" });
  }
}
