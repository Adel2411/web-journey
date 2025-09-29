import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/secret", authenticate, async (_, res) => {
  res.send({
    message: "my route secret",
  });
});

export default router;