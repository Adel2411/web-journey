import jwt from "jsonwebtoken";
import { httpError } from "../utils/errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      httpError("Authorization token required.", 401, "UNAUTHENTICATED")
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(httpError("Invalid or expired token.", 401, "INVALID_TOKEN"));
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.role) return next(httpError("Forbidden.", 403, "FORBIDDEN"));
    if (!allowedRoles.includes(req.user.role)) {
      return next(httpError("Forbidden.", 403, "FORBIDDEN"));
    }
    next();
  };
}
