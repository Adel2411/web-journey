import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "jwtSecret";

export function signJWT(payload, options = {}) {
  return jwt.sign(payload, secret, { expiresIn: "1h", ...options });
}

export function verifyJWT(token) {
  return jwt.verify(token, secret);
}
