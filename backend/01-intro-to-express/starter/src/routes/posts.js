import express from "express";
import logger  from "../middleware/logger.js";
import { getPosts, getPostById, getPostByAuthor, postCreateBlogPost, putUpdateBlogPostById } from "../controllers/postsController.js"; 
import { validationPostCreateBlogPost, validationPutUpdateBlogPostById } from "../middleware/validation.js";

export const routes = express.Router();

routes.get("/", getPosts);
routes.get("/:id", getPostById);
routes.get("/author/:author", getPostByAuthor);

routes.post("/", validationPostCreateBlogPost, postCreateBlogPost);

routes.put("/:id", validationPutUpdateBlogPostById, putUpdateBlogPostById);

routes.delete("/:id", deleteBlogPostById);