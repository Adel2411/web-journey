import express from "express";
import {
  getPosts,
  postPosts,
  getPostById,
  updatePost,
  deletePost
} from "../controllers/postsController.js";
import { validateNewPost, createdAt, updatedAt } from "../middlewares.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", validateNewPost, createdAt, postPosts);
router.get("/:id", getPostById);
router.put("/:id", createdAt, updatedAt, updatePost);
router.delete("/:id", deletePost);

export default router;
