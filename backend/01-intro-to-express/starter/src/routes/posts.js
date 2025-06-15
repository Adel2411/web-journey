import express from "express";
import timestamp from "../middleware/timesatamp.js";
import validation from "../middleware/validation.js";
import { handleGetPosts ,getPostById  ,createPost,updatePostById,deletePostById } from "../controllers/postsController.js";

export const routes = express.Router();
routes.get("/:id",getPostById);
routes.get("/", handleGetPosts);
routes.post("/",timestamp,validation,createPost);
routes.put("/:id",timestamp,validation,updatePostById);
routes.delete("/:id",deletePostById);
