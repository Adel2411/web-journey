import express from "express";
import logger from "../middleware/logger.js";
import { getPosts } from "../controllers/postsController.js";
import { postValidator, putValidator } from "../middleware/validation.js";
import { creatPost, deletPost, getPostById, getPosts, updatPost } from "../controllers/postsController.js";7


export const routes = express.Router();


routes.get("/:id", getPostById);
routes.get("/", getPosts);
routes.post("/",postValidator, creatPost);
routes.put("/:id",putValidator, updatPost);
routes.delete("/:id", deletPost);


