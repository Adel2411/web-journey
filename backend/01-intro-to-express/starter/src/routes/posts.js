import express from "express";
import logger from "../middleware/logger.js";
import { getPosts ,getPostById ,createPost,updatePostById,deletePostById } from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/", logger, getPosts);
routes.get("/:id",logger,getPostById);
routes.post("/",logger,createPost);
routes.put("/:id",logger,updatePostById);
routes.delete("/:id",logger,deletePostById);
