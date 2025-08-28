// Middleware to validate auth requests using Zod
import { z } from "zod";
import { httpError } from "../utils/errorHandler.js";

// Strong password policy used across register and reset flows.
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Za-z]/, "Password must contain at least one letter.")
  .regex(/\d/, "Password must contain at least one digit.");

// Registration payload validation
const registerSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
    name: z.string().min(1, "Name is required"),
    age: z.coerce.number().int().min(18, "You must be at least 18 years old."),
    role: z.enum(["ADMIN", "USER"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Login validation to avoid leaking which field is wrong.
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// Forgot-password only needs a valid email format.
const forgotSchema = z.object({
  email: z.string().email(),
});

// Reset-password requires a token and a strong password; must match confirmation.
const resetSchema = z
  .object({
    token: z.string().min(1, "token is required"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Refresh requires a non-empty refreshToken string.
const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required"),
});

// Shared handler that returns the first error message.
function handleZod(parseResult, res, next) {
  if (parseResult.success) return next();
  const issue = parseResult.error.issues?.[0];
  const message = issue?.message || "Invalid request body.";
  return next(
    httpError(
      message,
      400,
      "VALIDATION_ERROR",
      parseResult.error.flatten().fieldErrors
    )
  );
}

// Validate: POST /api/auth/register
export function validateRegister(req, res, next) {
  const result = registerSchema.safeParse(req.body ?? {});
  return handleZod(result, res, next);
}

// Validate: POST /api/auth/login
export function validateLogin(req, res, next) {
  const result = loginSchema.safeParse(req.body ?? {});
  return handleZod(result, res, next);
}

// Validate: POST /api/auth/forgot-password
export function validateForgot(req, res, next) {
  const result = forgotSchema.safeParse(req.body ?? {});
  return handleZod(result, res, next);
}

// Validate: POST /api/auth/reset-password
export function validateReset(req, res, next) {
  const result = resetSchema.safeParse(req.body ?? {});
  return handleZod(result, res, next);
}

// Validate: POST /api/auth/refresh
export function validateRefresh(req, res, next) {
  const result = refreshSchema.safeParse(req.body ?? {});
  return handleZod(result, res, next);
}
