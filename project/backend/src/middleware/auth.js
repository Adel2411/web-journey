import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(403).json({ error: "Forbidden." });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden." });
    }
    next();
  };
}
