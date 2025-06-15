import express from "express";
import logger from "../middleware/logger.js";
import { getPosts, getPostById, createPost, putPostById, deletePostById } from "../controllers/postsController.js";
import validation from "../middleware/validation.js";
import { create } from "domain";

export const routes = express.Router();

routes.get("/", logger, getPosts);

// get post by id
routes.get("/:id", logger, getPostById)

// create a new post
routes.post("/", logger, validation, createPost)

// put 
routes.put("/:id", logger, validation, putPostById)

// delete post by id
routes.delete("/:id", logger, deletePostById);