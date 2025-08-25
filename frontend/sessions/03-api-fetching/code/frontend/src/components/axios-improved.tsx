import React, { useState, useEffect } from "react";
import axios from "axios";
import type { IPost } from "../types/post";

const BASE_URL = "http://localhost:8080/api/posts";

// Axios Instance
const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		// auth example
		// const token = localStorage.getItem('authToken');
		// if (token) {
		//     config.headers.Authorization = `Bearer ${token}`;
		// }
		console.log(`Request 📤 ${config.method?.toUpperCase()} ${config.url}`);
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
	(response) => {
		// auth example
		// async (error) => {
		// 	if (error.response?.status === 401) {
		// 		const newToken = await refreshToken();
		// 		localStorage.setItem("authToken", newToken);
		// 		error.config.headers.Authorization = `Bearer ${newToken}`;
		// 		return api.request(error.config);
		// 	}
		// 	return Promise.reject(error);
		// };
		console.log(`Response 📥 ${response.status} ${response.config.url}`);
		return response;
	},
	(error) => {
		console.error("❌ API Error:", error.response?.status, error.message);
		return Promise.reject(error);
	}
);

export const AxiosImproved = () => {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [updating, setUpdating] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [newPost, setNewPost] = useState({
		title: "",
		content: "",
	});

	const fetchPosts = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get("/");
			console.log("posts: ", response);
			setPosts(response.data.posts || []);
		} catch (err) {
			handleApiError(err, "Failed to fetch posts");
		} finally {
			setLoading(false);
		}
	};

	const createPost = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			// no need for headers --> they are in the instance already
			const response = await api.post("/", newPost);
			console.log("post created: ", response.data);

			setNewPost({ title: "", content: "" });
			setSubmitting(false);
			await fetchPosts();
		} catch (err) {
			handleApiError(err, "Failed to create post");
		}
	};

	const deletePost = async (id: string) => {
		setDeleting(id);
		setError(null);

		try {
			await api.delete(`/${id}`);

			await fetchPosts();
		} catch (err) {
			handleApiError(err, "Failed to delete post");
		} finally {
			setDeleting(null);
		}
	};

	const updatePost = async (
		id: string,
		updatedData: Omit<IPost, "id" | "date">
	) => {
		setUpdating(id);
		setError(null);

		try {
			const response = await api.put(`/${id}`, updatedData);
			console.log("post updated: ", response.data);

			await fetchPosts();
		} catch (err) {
			handleApiError(err, "Failed to update post");
		} finally {
			setUpdating(null);
		}
	};

	// Centralized error handling
	const handleApiError = (err: any, defaultMessage: string) => {
		if (axios.isAxiosError(err)) {
			if (err.response) {
				const status = err.response.status;
				const message = err.response.data?.message || err.message;

				switch (status) {
					case 400:
						setError(`Bad Request: ${message}`);
						break;
					case 401:
						setError("Unauthorized - Please login");
						break;
					case 404:
						setError("Resource not found");
						break;
					case 500:
						setError("Server error - Please try again later");
						break;
					default:
						setError(`HTTP ${status}: ${message}`);
				}
			} else if (err.request) {
				setError("Network error - Please check your connection");
			} else {
				setError(err.message);
			}
		} else {
			setError(defaultMessage);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return (
		<div className="p-10 mx-auto">
			{error && (
				<div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
					Error: {error}
				</div>
			)}

			<div className="flex gap-10 md:gap-20 min-h-screen mt-10">
				<div className="w-1/3 flex-shrink-0">
					<form
						onSubmit={createPost}
						className="p-4 border rounded-lg bg-gray-50 sticky top-6"
					>
						<h3 className="text-lg font-semibold mb-4">
							Create New Post (Axios Improved)
						</h3>
						<div className="grid gap-4">
							<input
								type="text"
								placeholder="Post Title"
								value={newPost.title}
								onChange={(e) =>
									setNewPost({ ...newPost, title: e.target.value })
								}
								className="p-2 border rounded w-full"
								required
							/>
							<textarea
								placeholder="Post Content"
								value={newPost.content}
								onChange={(e) =>
									setNewPost({ ...newPost, content: e.target.value })
								}
								className="p-2 border rounded h-32 w-full"
								required
							/>
							<button
								type="submit"
								disabled={submitting}
								className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 w-full"
							>
								{submitting ? "Creating..." : "Create Post"}
							</button>
						</div>
					</form>
				</div>

				<div className="flex-1">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Posts ({posts.length})</h3>
							<button
								onClick={fetchPosts}
								disabled={loading}
								className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
							>
								Refresh
							</button>
						</div>

						{loading ? (
							<div className="mt-4 text-center py-2 text-blue-600 bg-blue-100 text-sm border border-blue-400 px-3 rounded">
								Loading...
							</div>
						) : (
							<div className="grid gap-4">
								{posts.length === 0 ? (
									<div className="text-center py-8 text-gray-500">
										No blogs found. Create your first blog post!
									</div>
								) : (
									posts.map((post) => (
										<PostCard
											key={post.id}
											post={post}
											onDelete={deletePost}
											isDeleting={deleting === post.id}
											onUpdate={updatePost}
											isUpdating={updating === post.id}
											loading={loading}
										/>
									))
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const PostCard = ({
	post,
	onDelete,
	isDeleting,
	onUpdate,
	isUpdating,
	loading,
}: {
	post: any;
	onDelete: any;
	isDeleting: boolean;
	onUpdate: any;
	isUpdating: boolean;
	loading: boolean;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState({
		title: post.title,
		content: post.content,
	});

	const handleEdit = () => {
		setIsEditing(true);
		setEditData({ title: post.title, content: post.content });
	};

	const handleSave = async () => {
		await onUpdate(post.id, editData);
		setIsEditing(false);
	};

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this post?")) {
			onDelete(post.id);
		}
	};

	if (isEditing) {
		return (
			<div className="border rounded-lg p-4 bg-yellow-50 shadow">
				<div className="grid gap-3">
					<input
						type="text"
						value={editData.title}
						onChange={(e) =>
							setEditData({ ...editData, title: e.target.value })
						}
						className="p-2 border rounded font-semibold"
					/>
					<textarea
						value={editData.content}
						onChange={(e) =>
							setEditData({ ...editData, content: e.target.value })
						}
						className="p-2 border rounded h-24"
					/>
					<div className="w-full flex justify-end gap-2">
						<button
							onClick={() => setIsEditing(false)}
							disabled={isUpdating}
							className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={isUpdating}
							className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:opacity-50"
						>
							{isUpdating ? "Saving..." : "Save"}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="border rounded-lg p-4 bg-white shadow">
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<h4 className="text-xl font-semibold">{post.title}</h4>
					<p className="mt-2 text-gray-700">{post.content}</p>
					<p className="mt-2 text-xs text-gray-500">ID: {post.id}</p>
				</div>
				<div className="flex gap-2 ml-4">
					<button
						onClick={handleEdit}
						disabled={loading}
						className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
					>
						Edit
					</button>
					<button
						onClick={handleDelete}
						disabled={loading || isDeleting}
						className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>
		</div>
	);
};
