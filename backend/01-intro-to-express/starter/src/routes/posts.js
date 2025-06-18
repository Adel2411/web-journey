import express, { Router } from "express";
import logger from "../middleware/logger.js";
import { postValidator, putValidator } from "../middleware/validation.js";
import { creatPost, deletPost, getPostByAuthor, getPostById, getPosts, updatPost } from "../controllers/postsController.js";

export const routes = express.Router();


routes.get("/author", getPostByAuthor);
routes.get("/:id", getPostById);
routes.get("/", logger, getPosts);
routes.get("/", getPosts);
routes.post("/",postValidator, creatPost);
routes.put("/:id",putValidator, updatPost);
routes.delete("/:id", deletPost);

