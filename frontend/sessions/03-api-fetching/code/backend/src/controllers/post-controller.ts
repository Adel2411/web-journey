import type { PostService } from "../services/post.service";
import type { IPost } from "../types/post";
import type { Request, Response } from "express";

class BlogController {
	constructor(private postService: PostService) {}

	async createPost(req: Request, res: Response) {
		try {
			const post: IPost = req.body;
			console.log("post data: ", post);
			await this.postService.savePost(post);
			res.status(201).json({ message: "Post created successfully" });
			console.log("post has been created!");
		} catch (error) {
			res.status(500).json({ message: "Error creating post", error });
		}
	}

	async getPosts(req: Request, res: Response) {
		try {
			const posts = await this.postService.getPosts();
			res.status(200).json({ posts });
		} catch (error) {
			res.status(500).json({ message: "Error fetching posts", error });
		}
	}

	async getPostById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const post = this.postService.getPostById(id as string);

			if (!post) {
				res.status(404).json({ message: "Post not found" });
				return;
			}

			res.status(200).json(post);
		} catch (error) {
			res.status(500).json({ message: "Error fetching post", error });
		}
	}

	async deletePostById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = this.postService.deletePostById(id as string);

			if (!deleted) {
				res.status(404).json({ message: "Post not found" });
				return;
			}

			res.status(200).json({ message: "Post deleted successfully" });
		} catch (error) {
			res.status(500).json({ message: "Error deleting post", error });
		}
	}

	async updatePostById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const updatedData = req.body;
			const updatedPost = this.postService.updatePostById(
				id as string,
				updatedData
			);

			if (!updatedPost) {
				res.status(404).json({ message: "Post not found" });
				return;
			}

			res.status(200).json({
				message: "Post updated successfully",
				post: updatedPost,
			});
		} catch (error) {
			res.status(500).json({ message: "Error updating post", error });
		}
	}
}

export default BlogController;
