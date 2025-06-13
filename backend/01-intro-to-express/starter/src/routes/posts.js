import express from "express";
import logger from "../middleware/logger.js";
import timestamp from "../middleware/timesatamp.js";
import validation from "../middleware/validation.js";
import { getPosts ,getPostById ,createPost,updatePostById,deletePostById } from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/", logger, getPosts);
routes.get("/:id",logger,getPostById);
routes.post("/",logger,timestamp,validation,createPost);
routes.put("/:id",logger,timestamp,validation,updatePostById);
routes.delete("/:id",logger,deletePostById);
