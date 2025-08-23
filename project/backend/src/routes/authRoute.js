import express from "express";
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  logoutAllController,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  validateForgot,
  validateReset,
  validateRefresh,
} from "../middleware/validateAuth.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import {
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/passwordController.js";

const router = express.Router();

// Rate limiters
const rlShort = createRateLimiter({
  windowMs: 60_000,
  max: 10,
  keyPrefix: "auth",
  message: "Too many requests. Please wait a minute.",
});
const rlLogin = createRateLimiter({
  windowMs: 60_000,
  max: 5,
  keyPrefix: "login",
  message: "Too many login attempts. Please wait a minute.",
});

// POST /api/auth/register
router.post("/register", rlShort, validateRegister, registerController);

// POST /api/auth/login
router.post("/login", rlLogin, validateLogin, loginController);

// Password reset
router.post(
  "/forgot-password",
  rlShort,
  validateForgot,
  forgotPasswordController
);
router.post("/reset-password", rlShort, validateReset, resetPasswordController);

// Refresh token and logout
router.post("/refresh", rlShort, validateRefresh, refreshTokenController);
router.post("/logout", logoutController);
router.post("/logout-all", logoutAllController);

export default router;
