import express from "express";
import { getPosts, getPostById, addPost, updatePost, deletePost, getPostByAuthor } from "../controllers/postsController.js";
import {addTimeStamp} from "../middleware/timesatamp.js";

export const routes = express.Router();

//marche
routes.get("/", getPosts);

//marche ausssi
routes.get("/:id", getPostById);

//marche
routes.get("/authors/:author", getPostByAuthor);

//marche
routes.post("/",addTimeStamp, addPost);

//marche
routes.put("/:id", addTimeStamp, updatePost);

//marche
routes.delete("/:id", deletePost);

