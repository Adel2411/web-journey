import express from "express";
import logger from "../middleware/logger.js";
import { getPosts, getPostById, getPostsByAuthor, createPost, updatePost } from "../controllers/postsController.js";
import { validatePost, validatePut } from "../middleware/validation.js";

export const routes = express.Router();

// routes.get("/", logger, getPosts);

routes.get("/", logger, (req, res) => {   // Handle both /posts and /posts?author=...
    const { author } = req.query;
    // /posts?author=...
    if (author) {
        return getPostsByAuthor(req, res);
    }
    // /posts
    return getPosts(req, res);
});

routes.get("/:id", logger, getPostById);
routes.post("/", validatePost, logger, createPost);
routes.put("/:id", validatePut, logger, updatePost);

