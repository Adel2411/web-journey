import express from "express";
import logger from "../middleware/logger.js";
import timestamp from "../middleware/timesatamp.js";
import validation from "../middleware/validation.js";
import { getAllPosts } from "../controllers/postsController.js";
import { getPostsByID } from "../controllers/postsController.js";
import { createPost } from "../controllers/postsController.js";
import { updatepost } from "../controllers/postsController.js";
import {deletepost} from "../controllers/postsController.js";
export const routes = express.Router();

routes.get("/", timestamp,logger,getAllPosts);
routes.get("/:id", logger, timestamp,getPostsByID );
routes.post("/",logger, timestamp, validation, createPost);
routes.put("/:id",logger, timestamp, validation, updatepost);
routes.delete("/:id",logger, timestamp, deletepost);
