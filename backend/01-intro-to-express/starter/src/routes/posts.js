import express from "express";
import timestamp from "../middleware/timesatamp.js";
import { getPosts } from "../controllers/postsController.js";
import { getPostsByid } from "../controllers/postsController.js";
import { getPostByAuthor } from "../controllers/postsController.js";
import { createPost } from "../controllers/postsController.js";
import { updatePost } from "../controllers/postsController.js";
import { deletePost } from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/", getPosts);
routes.get("/author", getPostByAuthor);
routes.get("/:id", getPostsByid);
routes.post("/", timestamp, createPost);
routes.put("/:id", updatePost);
routes.delete("/:id", deletePost);