import express from "express";
import logger from "../middleware/logger.js";
import { addTimestamps, updateTimestamp } from "../middleware/timesatamp.js";
import { getPosts, getPostById, getPostsByAuthor, createPost, updatePost, deletePost } from "../controllers/postsController.js";
import { validatePost, validatePut } from "../middleware/validation.js";

export const routes = express.Router();

// GET /posts or /posts?author=name
routes.get("/", logger, (req, res, next) => {
    if(req.query.author) {
        return getPostsByAuthor(req, res);
    } else {
        return getPosts(req, res);
    }
});

// GET /posts/:id
routes.get("/:id", getPostById);

// POST /posts to add a new blog post
routes.post("/", logger, validatePost, addTimestamps, createPost);

// PUT /posts/:id
routes.put("/:id", logger, validatePut, updateTimestamp, updatePost);

// DELETE /posts/:id
routes.delete("/:id", logger, deletePost);
