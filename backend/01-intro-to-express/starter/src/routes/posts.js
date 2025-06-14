import express from "express";
import logger from "../middleware/logger.js";
import { createUserValidator ,updateValidator,validator  } from "../middleware/validation.js";
import {getPosts,getPostById ,getPostByauthor,createPost,updatePost,deletePost} from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/", logger, getPosts);
routes.get("/:id", logger, getPostById);
routes.get("/author/:author", logger, getPostByauthor);
routes.post("/", logger,createUserValidator,validator , createPost);
routes.put("/:id", logger,updateValidator,validator ,updatePost);
routes.delete("/:id", logger, deletePost);