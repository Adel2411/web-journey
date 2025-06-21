import express from "express";
import { addTimestamps, updateTimestamp } from "../middleware/timesatamp.js";
import { getPostById, createPost, updatePost, deletePost, handleGetPosts } from "../controllers/postsController.js";
import { validatePost, validatePut } from "../middleware/validation.js";

export const routes = express.Router();

// GET /posts or /posts?author=name
routes.get("/", handleGetPosts); // j'ai corrigé ça 

// GET /posts/:id
routes.get("/:id", getPostById);

// POST /posts to add a new blog post
routes.post("/", validatePost, addTimestamps, createPost);

// PUT /posts/:id
routes.put("/:id", validatePut, updateTimestamp, updatePost);

// DELETE /posts/:id
routes.delete("/:id", deletePost);
