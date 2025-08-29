import crypto from "node:crypto";
import { prisma } from "./prisma.js";

export async function createRefreshToken(userId, ttlDays = 30) {
  // revoke existing tokens optionally? We'll allow multiple sessions.
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
  return { token, expiresAt };
}

export async function verifyRefreshToken(token) {
  const rec = await prisma.refreshToken.findUnique({ where: { token } });
  if (!rec) return null;
  if (rec.revokedAt) {
    try {
      await prisma.refreshToken.delete({ where: { token } });
    } catch (_) {}
    return null;
  }
  if (rec.expiresAt <= new Date()) {
    try {
      await prisma.refreshToken.delete({ where: { token } });
    } catch (_) {}
    return null;
  }
  return rec;
}

export async function rotateRefreshToken(oldToken, userId, ttlDays = 30) {
  try {
    await prisma.refreshToken.delete({ where: { token: oldToken } });
  } catch (_) {}
  return createRefreshToken(userId, ttlDays);
}

export async function revokeRefreshToken(token) {
  try {
    await prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  } catch (_) {
    // if not found, ignore for idempotency
  }
}

export async function revokeAllRefreshTokensForUser(userId) {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}
