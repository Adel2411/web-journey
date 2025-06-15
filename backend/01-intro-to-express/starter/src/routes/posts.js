import express from "express";
import logger  from "../middleware/logger.js";
import { getPosts, getPostById, getPostByAuthor, postCreateBlogPost, putUpdateBlogPostById } from "../controllers/postsController.js"; 
import { validationPostCreateBlogPost, validationPutUpdateBlogPostById } from "../middleware/validation.js";

export const routes = express.Router();

routes.get("/posts", logger, getPosts);
routes.get("/posts/:id", logger, getPostById);
routes.get("/posts/author/:author", logger, getPostByAuthor);

routes.post("/posts", logger, validationPostCreateBlogPost, postCreateBlogPost);

routes.put("/posts/:id", logger, validationPutUpdateBlogPostById, putUpdateBlogPostById);

routes.delete("/posts/:id", logger, (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});