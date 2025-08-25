import { Router } from "express";
import PostController from "../controllers/post-controller";
import { PostService } from "../services/post.service";

const router = Router();
const postService = new PostService();
const postController = new PostController(postService);

export function setBlogRoutes(app: any) {
	app.use("/api/posts", router);
	router.get("/", postController.getPosts.bind(postController));
	router.get("/:id", postController.getPostById.bind(postController));
	router.post("/", postController.createPost.bind(postController));
	router.delete("/:id", postController.deletePostById.bind(postController));
	router.put("/:id", postController.updatePostById.bind(postController));
}
