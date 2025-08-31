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
} from "../utils/emailVerificationToken.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import { ok, created, fail, noContentOk } from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const INCLUDE_REFRESH_TOKEN_IN_RESPONSE =
  String(
    process.env.INCLUDE_REFRESH_TOKEN_IN_RESPONSE || "true"
  ).toLowerCase() === "true";

//Utility function to issue access tokens JWT
function issueAccessToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
}

// Parse duration strings like "15m", "1h", "2d" into seconds
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

// Register a new user
export const registerController = async (req, res) => {
  const { email, password, confirmPassword, name, age, role } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return fail(res, "Email already registered.", 409, "CONFLICT");
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create the user
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
    console.warn(
      "[verify-email] failed to create/send token:",
      e?.message || e
    );
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
  return created(res, body);
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return fail(res, "Invalid credentials.", 401, "UNAUTHENTICATED");
  }
  const REQUIRE_VERIFIED =
    String(process.env.REQUIRE_VERIFIED_EMAIL || "false").toLowerCase() ===
    "true";
  // If email verification is required, check if the user is verified
  if (REQUIRE_VERIFIED && !user.isVerified) {
    return fail(
      res,
      "Please verify your email before logging in.",
      403,
      "EMAIL_NOT_VERIFIED"
    );
  }
  // Check account lockout
  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    const seconds = Math.ceil((user.lockoutUntil - new Date()) / 1000);
    return fail(
      res,
      `Account locked. Try again in ${seconds}s.`,
      423,
      "LOCKED"
    );
  }
  // Verify password
  const valid = await bcrypt.compare(password, user.password);
  // If password is invalid, increment failed login attempts
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
    return fail(res, "Invalid credentials.", 401, "UNAUTHENTICATED");
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
  return ok(res, body);
};

// Refresh Token
export const refreshTokenController = async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  if (!token) return fail(res, "refreshToken is required.", 400, "BAD_REQUEST");
  const rec = await verifyRefreshToken(token);
  if (!rec)
    return fail(res, "Invalid or expired refresh token.", 401, "INVALID_TOKEN");
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
  return ok(res, body);
};

// Verify Email
export const verifyEmailController = async (req, res) => {
  const token = req.query?.token || req.body?.token;
  if (!token) return fail(res, "token is required", 400, "BAD_REQUEST");
  const rec = await verifyVerificationToken(token);
  if (!rec) return fail(res, "Invalid or expired token.", 400, "INVALID_TOKEN");
  await prisma.user.update({
    where: { id: rec.userId },
    data: { isVerified: true },
  });
  await consumeVerificationToken(token);
  return ok(res, { message: "Email verified successfully." });
};

// Logout
export const logoutController = async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.refreshToken;
  if (token) await revokeRefreshToken(token);
  return noContentOk(res, "Logged out successfully.");
};

// Logout from all devices
export const logoutAllController = async (req, res) => {
  // Requires auth; if not authenticated, return 401
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    try {
      const decoded = jwt.verify(parts[1], JWT_SECRET);
      await revokeAllRefreshTokensForUser(decoded.userId);
      return noContentOk(res, "Logged out from all devices.");
    } catch {
      return fail(res, "Invalid token.", 401, "INVALID_TOKEN");
    }
  }
  return fail(res, "Authorization required.", 401, "UNAUTHENTICATED");
};
