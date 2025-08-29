import nodemailer from "nodemailer";

let transporter;

function createTransporter() {
  // Prefer explicit SMTP config from env; otherwise fall back to JSON transport (logs only)
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } =
    process.env;

  if (SMTP_HOST) {
    const port = Number(SMTP_PORT) || 587;
    const secure = String(SMTP_SECURE).toLowerCase() === "true" || port === 465;
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure,
      auth:
        SMTP_USER && SMTP_PASS
          ? {
              user: SMTP_USER,
              pass: SMTP_PASS,
            }
          : undefined,
    });
  }

  // Fallback: don't send real emails, just output the message as JSON in logs
  return nodemailer.createTransport({ jsonTransport: true });
}

export function getMailer() {
  if (!transporter) transporter = createTransporter();
  return transporter;
}

export async function sendMail({ to, subject, text, html, from }) {
  const mailer = getMailer();
  const info = await mailer.sendMail({
    from: from || process.env.EMAIL_FROM || "no-reply@collabnote.local",
    to,
    subject,
    text,
    html,
  });

  // When using jsonTransport, info.message contains the serialized message
  if (mailer.options && mailer.options.jsonTransport) {
    try {
      // Best-effort debug log; safe in dev
      const payload =
        typeof info.message === "string"
          ? info.message
          : JSON.stringify(info.message);
      console.log("[mailer] JSON transport output:", payload);
    } catch (_) {
      // ignore
    }
  }
  return info;
}

export async function sendPasswordResetEmail({ to, token, user }) {
  const appName = process.env.APP_NAME || "CollabNote";
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetPath = process.env.RESET_PATH || "/reset-password";
  const resetUrl = `${frontendBase}${resetPath}?token=${encodeURIComponent(
    token
  )}`;

  const subject = `${appName} password reset`;
  const greetingName = user?.name ? user.name : "there";
  const text =
    `Hi ${greetingName},\n\n` +
    `We received a request to reset your ${appName} password.\n\n` +
    `Reset link: ${resetUrl}\n\n` +
    `If you did not request this, you can safely ignore this email. The link will expire shortly.`;

  const html = `
    <p>Hi ${greetingName},</p>
    <p>We received a request to reset your <strong>${appName}</strong> password.</p>
    <p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:6px">Reset your password</a>
    </p>
    <p>If you did not request this, you can safely ignore this email.</p>
    <p style="color:#6b7280;font-size:12px">This link may expire; if it does, request a new one.</p>
  `;

  return sendMail({ to, subject, text, html });
}

export async function sendVerificationEmail({ to, token, user }) {
  const appName = process.env.APP_NAME || "CollabNote";
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyPath = process.env.VERIFY_PATH || "/verify-email";
  const verifyUrl = `${frontendBase}${verifyPath}?token=${encodeURIComponent(
    token
  )}`;

  const subject = `${appName} email verification`;
  const greetingName = user?.name ? user.name : "there";
  const text =
    `Hi ${greetingName},\n\n` +
    `Please verify your email to activate your ${appName} account.\n\n` +
    `Verify link: ${verifyUrl}\n\n` +
    `If you did not sign up, you can ignore this email.`;

  const html = `
    <p>Hi ${greetingName},</p>
    <p>Please verify your email to activate your <strong>${appName}</strong> account.</p>
    <p>
      <a href="${verifyUrl}" style="display:inline-block;padding:10px 16px;background:#10b981;color:#fff;text-decoration:none;border-radius:6px">Verify email</a>
    </p>
    <p>If you did not sign up, you can ignore this email.</p>
  `;

  return sendMail({ to, subject, text, html });
}
