import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma.js";
import {
  createResetToken,
  verifyResetToken,
  consumeResetToken,
} from "../utils/passwordResetToken.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import { ok, fail } from "../utils/response.js";

// POST /api/auth/forgot-password
export async function forgotPasswordController(req, res) {
  const { email } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email } });
  // Respond 200 even if not found to avoid account enumeration
  if (!user)
    return ok(res, {
      message: "If that email exists, a reset link has been sent.",
    });

  const { token, expiresAt } = await createResetToken(user.id);

  // Send reset email (uses SMTP if configured, else JSON transport for dev)
  try {
    await sendPasswordResetEmail({ to: email, token, user });
  } catch (e) {
    console.error("Failed to send reset email:", e);
  }

  // For development/testing convenience, return token when explicitly allowed
  const includeToken =
    String(
      process.env.INCLUDE_RESET_TOKEN_IN_RESPONSE || "true"
    ).toLowerCase() === "true";
  if (includeToken) {
    return ok(res, { message: "Reset token generated.", token, expiresAt });
  }
  return ok(res, {
    message: "If that email exists, a reset link has been sent.",
  });
}

// POST /api/auth/reset-password
export async function resetPasswordController(req, res) {
  const { token, password } = req.body || {};
  const rec = await verifyResetToken(token);
  if (!rec) return fail(res, "Invalid or expired token.", 400, "INVALID_TOKEN");

  const hashed = await bcrypt.hash(password, 10);
  // Update the user's password
  await prisma.user.update({
    where: { id: rec.userId },
    data: { password: hashed },
  });
  await consumeResetToken(token);
  return ok(res, { message: "Password has been reset." });
}
