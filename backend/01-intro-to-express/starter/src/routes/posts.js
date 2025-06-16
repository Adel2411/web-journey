import express from "express";
import logger from "../middleware/logger.js";
import autoTimestamps from "../middleware/timesatamp.js";
import { validatePost, validatePut } from "../middleware/validation.js";
import {
  getPosts,
  getPostById,
  createPost,
  modifyPost,
  deletePost,
} from "../controllers/postsController.js";

export const router = express.Router();
router.use(logger);
router.use(autoTimestamps);

router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", validatePut, modifyPost);
router.post("/", validatePost, createPost);
router.delete("/:id", deletePost);
