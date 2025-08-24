import express from "express";
import { getPosts, getPostById, createPost, putPostById, deletePostById } from "../controllers/postsController.js";
import { validation } from "../middleware/validation.js";
import { create } from "domain";
import timeStamp from "../middleware/timesatamp.js";

export const routes = express.Router();

// get posts and get posts by author
routes.get("/", getPosts);

// get post by id
routes.get("/:id", getPostById)

// create a new post
routes.post("/", validation, timeStamp, createPost)

// put 
routes.put("/:id", validation, timeStamp, putPostById)

// delete post by id
routes.delete("/:id", deletePostById);