import crypto from "node:crypto";
import { prisma } from "./prisma.js";

const DEFAULT_TTL_MIN = Number(process.env.VERIFY_TOKEN_TTL_MIN || 60 * 24); // 24h

export async function createVerificationToken(
  userId,
  ttlMin = DEFAULT_TTL_MIN
) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);
  await prisma.emailVerification.create({ data: { token, userId, expiresAt } });
  return { token, expiresAt };
}

export async function verifyVerificationToken(token) {
  const rec = await prisma.emailVerification.findUnique({ where: { token } });
  if (!rec) return null;
  if (rec.expiresAt <= new Date()) {
    try {
      await prisma.emailVerification.delete({ where: { token } });
    } catch (_) {}
    return null;
  }
  return rec;
}

export async function consumeVerificationToken(token) {
  try {
    await prisma.emailVerification.delete({ where: { token } });
  } catch (_) {}
}
