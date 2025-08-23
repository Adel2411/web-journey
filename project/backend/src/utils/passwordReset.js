import crypto from "crypto";
import { prisma } from "../utils/prisma.js";

export async function createResetToken(userId, ttlMinutes = 15) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  // Remove existing tokens for this user
  await prisma.passwordReset.deleteMany({ where: { userId } });

  await prisma.passwordReset.create({
    data: { token, userId, expiresAt },
  });
  return { token, expiresAt };
}

export async function verifyResetToken(token) {
  const rec = await prisma.passwordReset.findUnique({ where: { token } });
  if (!rec) return null;
  if (rec.expiresAt.getTime() < Date.now()) {
    // cleanup expired
    await prisma.passwordReset.delete({ where: { token } });
    return null;
  }
  return rec;
}

export async function consumeResetToken(token) {
  try {
    await prisma.passwordReset.delete({ where: { token } });
  } catch (_) {
    // ignore
  }
}
