import express from "express";
import controllers from "../controllers/userControllers.js";
const { registerUser, login } = controllers;

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);

export default router;
