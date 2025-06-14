import express from "express";
import { createUserValidator ,updateValidator,validator  } from "../middleware/validation.js";
import {getPosts,getPostById ,getPostByauthor,createPost,updatePost,deletePost} from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/",  getPosts);
routes.get("/author", getPostByauthor);
routes.get("/:id", getPostById);
routes.post("/", createUserValidator,validator , createPost);
routes.put("/:id", updateValidator,validator ,updatePost);
routes.delete("/:id",deletePost);