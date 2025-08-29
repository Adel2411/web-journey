import express from "express"
import { register, login} from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post('/register',authLimiter, register);
router.post('/login',authLimiter,  login);

export default router;