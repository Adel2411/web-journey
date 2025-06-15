import express from "express";
import logger from "../middleware/logger.js";
import { getPosts } from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/posts", logger, getPosts);
routes.get("/posts/:id", logger, getPostById);
routes.get("/posts/author/:author", logger, getPostByAuthor);

routes.post("/posts", logger, validationPostCreateBlogPost, postCreateBlogPost);