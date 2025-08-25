import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	getAllPostsHandler,
	createPostHandler,
	updatePostHandler,
	deletePostHandler,
} from "../api/posts";
import type { IPost } from "../types/post";

export const ReactQuery = () => {
	const queryClient = useQueryClient();
	const [newPost, setNewPost] = useState({
		title: "",
		content: "",
	});
	const [deletingId, setDeletingId] = useState<string | null>(null);

	// GET ALL
	const {
		data: posts = [],
		isLoading, // when the component mounts for the first time (first load)
		isFetching, // every time a fetch is happening, including <<<background refetches>>>
		error,
		refetch,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: getAllPostsHandler,
		staleTime: 5 * 60 * 1000,
	});

	// CREATE
	const createPostMutation = useMutation({
		mutationFn: createPostHandler, // just a REFERENCE to the function
		onSuccess: () => {
			// invalidate and refetch posts <<update the cache>>
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			setNewPost({ title: "", content: "" });
		},
		onError: (error: any) => {
			console.error("create post error:", error);
		},
	});

	// UPDATE
	const updatePostMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Omit<IPost, "id" | "date">;
		}) => updatePostHandler(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error: any) => {
			console.error("update post error:", error);
		},
	});

	// DELETE
	const deletePostMutation = useMutation({
		mutationFn: deletePostHandler,
		onMutate: (deletingId) => {
			setDeletingId(deletingId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			setDeletingId(null);
		},
		onError: () => {
			setDeletingId(null);
		},
	});

	const handleCreatePost = async (e: React.FormEvent) => {
		e.preventDefault();
		createPostMutation.mutate(newPost);
	};

	const handleUpdatePost = (id: string, data: Omit<IPost, "id" | "date">) => {
		updatePostMutation.mutate({ id, data });
	};

	const handleDeletePost = (id: string) => {
		if (confirm("Are you sure you want to delete this post?")) {
			deletePostMutation.mutate(id);
		}
	};

	return (
		<div className="p-10 mx-auto">
			{error && (
				<div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
					Error: {(error as any)?.message || "Something went wrong"}
				</div>
			)}

			{createPostMutation.error && (
				<div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
					Create Error: {(createPostMutation.error as any)?.message}
				</div>
			)}

			{updatePostMutation.error && (
				<div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
					Update Error: {(updatePostMutation.error as any)?.message}
				</div>
			)}

			{deletePostMutation.error && (
				<div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
					Delete Error: {(deletePostMutation.error as any)?.message}
				</div>
			)}

			<div className="flex gap-10 md:gap-20 min-h-screen mt-10">
				<div className="w-1/3 flex-shrink-0">
					<form
						onSubmit={handleCreatePost}
						className="p-4 border rounded-lg bg-gray-50 sticky top-6"
					>
						<h3 className="text-lg font-semibold mb-4">
							Create New Post (React Query)
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
								disabled={createPostMutation.isPending}
								className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 w-full"
							>
								{createPostMutation.isPending ? "Creating..." : "Create Post"}
							</button>
						</div>
					</form>
				</div>

				<div className="flex-1">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Posts ({posts.length})</h3>

							<button
								onClick={() => refetch()}
								disabled={isLoading}
								className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
							>
								{isLoading ? "Loading..." : "Refresh"}
							</button>
						</div>

						{isLoading || isFetching ? (
							<div className="mt-4 text-center py-2 text-blue-600 bg-blue-100 text-sm border border-blue-400 px-3 rounded">
								Loading posts...
							</div>
						) : (
							<div className="grid gap-4">
								{posts.length === 0 ? (
									<div className="text-center py-8 text-gray-500">
										No posts found. Create your first post!
									</div>
								) : (
									posts.map((post: IPost) => (
										<PostCard
											key={post.id}
											post={post}
											onDelete={handleDeletePost}
											isDeleting={deletingId === post.id}
											onUpdate={handleUpdatePost}
											isUpdating={updatePostMutation.isPending}
											loading={isLoading}
										/>
									))
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			<ReactQueryDevtools initialIsOpen={false} />
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
	post: IPost;
	onDelete: (id: string) => void;
	isDeleting: boolean;
	onUpdate: (id: string, data: Omit<IPost, "id" | "date">) => void;
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
		onUpdate(post.id, editData);
		setIsEditing(false);
	};

	const handleDelete = () => {
		onDelete(post.id);
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
