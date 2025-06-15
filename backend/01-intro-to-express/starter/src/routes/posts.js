import express from "express";
import { createUserValidator ,updateValidator,validator  } from "../middleware/validation.js";
import {getPosts,getPostById ,createPost,updatePost,deletePost} from "../controllers/postsController.js";
import timestampMiddleware from "../middleware/timesatamp.js";
export const routes = express.Router();

routes.get("/",  getPosts);
routes.get("/:id", getPostById);
routes.post("/", createUserValidator,validator,timestampMiddleware, createPost);
routes.put("/:id", updateValidator,validator,timestampMiddleware ,updatePost);
routes.delete("/:id",deletePost);