import express, { Router } from "express";
import logger from "../middleware/logger.js";
import { getPosts } from "../controllers/postsController.js";

export const routes = express.Router();

routes.get("/", logger, getPosts);

