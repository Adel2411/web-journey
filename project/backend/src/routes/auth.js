import express from "express";
import { register, login, verifyToken, logout } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", authenticate, verifyToken);  
router.post("/logout", authenticate, logout);     

export default router;