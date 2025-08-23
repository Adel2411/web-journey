import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";
import {
  createRefreshToken,
  verifyRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensForUser,
} from "../utils/refreshToken.js";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "1h";
const INCLUDE_REFRESH_TOKEN_IN_RESPONSE =
  String(
    process.env.INCLUDE_REFRESH_TOKEN_IN_RESPONSE || "true"
  ).toLowerCase() === "true";

function issueAccessToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
}

export const registerController = async (req, res) => {
  const { email, password, confirmPassword, name, age, role } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      age,
      role: role?.toUpperCase?.() === "ADMIN" ? "ADMIN" : undefined,
    },
  });
  const token = issueAccessToken(user.id, user.role);
  const { token: refreshToken, expiresAt } = await createRefreshToken(user.id);
  const { password: _, ...userInfo } = user;
  const body = { token, user: userInfo };
  if (INCLUDE_REFRESH_TOKEN_IN_RESPONSE) {
    body.refreshToken = refreshToken;
    body.refreshTokenExpiresAt = expiresAt;
  }
  res.status(201).json(body);
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  // Check account lockout
  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    const seconds = Math.ceil((user.lockoutUntil - new Date()) / 1000);
    return res
      .status(423)
      .json({ error: `Account locked. Try again in ${seconds}s.` });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const attempts = (user.failedLoginAttempts ?? 0) + 1;
    let data = { failedLoginAttempts: attempts };
    const MAX_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS || 5);
    const LOCK_MINUTES = Number(process.env.LOCKOUT_MINUTES || 15);
    if (attempts >= MAX_ATTEMPTS) {
      data = {
        failedLoginAttempts: 0,
        lockoutUntil: new Date(Date.now() + LOCK_MINUTES * 60 * 1000),
      };
    }
    await prisma.user.update({ where: { id: user.id }, data });
    return res.status(401).json({ error: "Invalid credentials." });
  }
  // On success clear attempts/lock
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockoutUntil: null },
  });
  const token = issueAccessToken(user.id, user.role);
  const { token: refreshToken, expiresAt } = await createRefreshToken(user.id);
  const { password: _, ...userInfo } = user;
  const body = { token, user: userInfo };
  if (INCLUDE_REFRESH_TOKEN_IN_RESPONSE) {
    body.refreshToken = refreshToken;
    body.refreshTokenExpiresAt = expiresAt;
  }
  res.json(body);
};

export const refreshTokenController = async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  if (!token)
    return res.status(400).json({ error: "refreshToken is required." });
  const rec = await verifyRefreshToken(token);
  if (!rec)
    return res.status(401).json({ error: "Invalid or expired refresh token." });
  const accessToken = issueAccessToken(rec.userId);
  // rotate refresh token for better security
  const { token: newRefreshToken, expiresAt } = await rotateRefreshToken(
    token,
    rec.userId
  );
  const body = { token: accessToken };
  if (INCLUDE_REFRESH_TOKEN_IN_RESPONSE) {
    body.refreshToken = newRefreshToken;
    body.refreshTokenExpiresAt = expiresAt;
  }
  return res.json(body);
};

export const logoutController = async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  if (token) await revokeRefreshToken(token);
  return res.status(204).send();
};

export const logoutAllController = async (req, res) => {
  // Requires auth; if not authenticated, return 401
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    try {
      const decoded = jwt.verify(parts[1], JWT_SECRET);
      await revokeAllRefreshTokensForUser(decoded.userId);
      return res.status(204).send();
    } catch {
      return res.status(401).json({ error: "Invalid token." });
    }
  }
  return res.status(401).json({ error: "Authorization required." });
};
