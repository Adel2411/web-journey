import express from "express";
import {logger} from "../middleware/logger.js";
import {validationPost,
  validationUpdate,} from "../middleware/validation.js";
import {TimestampPost,TimestampUpdate} from "../middleware/timesatamp.js";

import { getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost } from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/", logger, getPosts);
routes.get("/:id",logger,getPostById);
routes.post("/",[logger,validationPost,TimestampPost],createPost);
routes.put("/:id",[logger,validationUpdate,TimestampUpdate],updatePost);
routes.delete("/:id",logger,deletePost);
