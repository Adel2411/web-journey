import express from "express";
import { getPostById,filterPostsByAuthor,createPost,updatePost,deletePost } from "../controllers/postsController.js";
import { validatePost, validateUpdatePost } from '../middleware/validation.js';
import addTimestamps from '../middleware/timestamp.js';
export const routes = express.Router();

// GET /posts or /posts?author=...
routes.get('/', filterPostsByAuthor);  

// GET /posts/:id
routes.get('/:id', getPostById);

// POST /posts
routes.post('/', validatePost, addTimestamps, createPost);

// PUT /posts/:id
routes.put('/:id', validateUpdatePost, addTimestamps, updatePost);

// DELETE /posts/:id
routes.delete('/:id', deletePost);
