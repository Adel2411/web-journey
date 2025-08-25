import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { type IPost } from "../types/post";

const blogFilePath = path.join(__dirname, "../db/post.json");

export class PostService {
	savePost(post: { title: string; content: string }): IPost {
		const posts = this.getPosts();

		const newPost: IPost = {
			id: uuidv4(),
			title: post.title,
			content: post.content || "",
			date: new Date().toISOString(),
		};

		console.log("a new post has been created: ", newPost);

		posts.push(newPost);
		fs.writeFileSync(blogFilePath, JSON.stringify(posts, null, 2));
		return newPost;
	}

	getPosts(): IPost[] {
		if (!fs.existsSync(blogFilePath)) {
			return [];
		}
		const data = fs.readFileSync(blogFilePath, "utf-8");
		return JSON.parse(data) as IPost[];
	}

	getPostById(id: string): IPost | null {
		const posts = this.getPosts();
		const post = posts.find((post) => post.id === id);
		return post || null;
	}

	deletePostById(id: string): boolean {
		const posts = this.getPosts();
		const initialLength = posts.length;
		const filteredPosts = posts.filter((post) => post.id !== id);

		if (filteredPosts.length === initialLength) {
			return false; // Post not found
		}

		fs.writeFileSync(blogFilePath, JSON.stringify(filteredPosts, null, 2));
		return true; // Post deleted successfully
	}

	updatePostById(
		id: string,
		updatedData: Partial<Omit<IPost, "id">>
	): IPost | null {
		const posts = this.getPosts();
		const postIndex = posts.findIndex((post) => post.id === id);

		if (postIndex === -1) {
			return null;
		}

		const updatedPost: IPost = {
			...posts[postIndex],
			...(updatedData as Required<Pick<IPost, keyof typeof updatedData>>),
			id,
		};

		posts[postIndex] = updatedPost;
		fs.writeFileSync(blogFilePath, JSON.stringify(posts, null, 2));
		return posts[postIndex];
	}
}
