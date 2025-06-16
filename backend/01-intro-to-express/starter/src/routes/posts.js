import express from "express";
import { getPosts, getPostById, postCreateBlogPost, putUpdateBlogPostById, deleteBlogPostById } from "../controllers/postsController.js"; 
import { validationPostCreateBlogPost, validationPutUpdateBlogPostById } from "../middleware/validation.js";

export const routes = express.Router();

routes.get("/", getPosts);
routes.get("/:id", getPostById);

routes.post("/", validationPostCreateBlogPost, postCreateBlogPost);

routes.put("/:id", validationPutUpdateBlogPostById, putUpdateBlogPostById);

routes.delete("/:id", deleteBlogPostById);