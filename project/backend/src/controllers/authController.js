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
import {
  createVerificationToken,
  verifyVerificationToken,
  consumeVerificationToken,
} from "../utils/emailVerification.js";
import { sendVerificationEmail } from "../utils/mailer.js";

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

function parseExpiresToSeconds(input) {
  if (typeof input === "number") return input;
  const str = String(input || "").trim();
  const m = str.match(/^(\d+)\s*([smhd])?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const unit = (m[2] || "s").toLowerCase();
  const mult =
    unit === "s"
      ? 1
      : unit === "m"
      ? 60
      : unit === "h"
      ? 3600
      : unit === "d"
      ? 86400
      : 1;
  return n * mult;
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
  // Send verification email (requires DB schema for EmailVerification)
  try {
    const { token: verifyToken } = await createVerificationToken(user.id);
    await sendVerificationEmail({ to: user.email, token: verifyToken, user });
  } catch (e) {
    console.warn("[verify-email] failed to create/send token:", e?.message || e);
  }
  const token = issueAccessToken(user.id, user.role);
  const { token: refreshToken, expiresAt } = await createRefreshToken(user.id);
  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    age: user.age,
    createdAt: user.createdAt,
  };
  const body = {
  message: "User registered successfully. Please verify your email.",
    data: {
      user: safeUser,
      token,
      accessTokenExpiresIn: parseExpiresToSeconds(ACCESS_TOKEN_EXPIRES),
    },
  };
  if (INCLUDE_REFRESH_TOKEN_IN_RESPONSE) {
    body.data.refreshToken = refreshToken;
    body.data.refreshTokenExpiresAt = expiresAt;
  }
  res.status(201).json(body);
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  const REQUIRE_VERIFIED =
    String(process.env.REQUIRE_VERIFIED_EMAIL || "false").toLowerCase() ===
    "true";
  if (REQUIRE_VERIFIED && !user.isVerified) {
    return res
      .status(403)
      .json({ error: "Please verify your email before logging in." });
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
  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    age: user.age,
    createdAt: user.createdAt,
  };
  const body = {
    message: "Login successful",
    data: {
      user: safeUser,
      token,
      accessTokenExpiresIn: parseExpiresToSeconds(ACCESS_TOKEN_EXPIRES),
    },
  };
  if (INCLUDE_REFRESH_TOKEN_IN_RESPONSE) {
    body.data.refreshToken = refreshToken;
    body.data.refreshTokenExpiresAt = expiresAt;
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
  const body = {
    token: accessToken,
    accessTokenExpiresIn: parseExpiresToSeconds(ACCESS_TOKEN_EXPIRES),
  };
  if (INCLUDE_REFRESH_TOKEN_IN_RESPONSE) {
    body.refreshToken = newRefreshToken;
    body.refreshTokenExpiresAt = expiresAt;
  }
  return res.json(body);
};

export const verifyEmailController = async (req, res) => {
  const token = req.query?.token || req.body?.token;
  if (!token) return res.status(400).json({ error: "token is required" });
  const rec = await verifyVerificationToken(token);
  if (!rec) return res.status(400).json({ error: "Invalid or expired token." });
  await prisma.user.update({ where: { id: rec.userId }, data: { isVerified: true } });
  await consumeVerificationToken(token);
  return res.json({ message: "Email verified successfully." });
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
