
import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postsController.js";
import logger from "../middleware/logger.js";
import validatePost from "../middleware/validation.js";
import addTimestamps from "../middleware/timesatamp.js";

const router = express.Router();

// Apply logger middleware to all routes
router.use(logger);

// GET all posts or filter by author
router.get("/", getAllPosts);

// GET a specific post by ID
router.get("/:id", getPostById);

// POST a new post with validation and timestamps
router.post("/", validatePost, addTimestamps, createPost);

// PUT update post by ID with validation and timestamp
router.put("/:id", validatePost, addTimestamps, updatePost);

// DELETE a post by ID
router.delete("/:id", deletePost);

export default router;
