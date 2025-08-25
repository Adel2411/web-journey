import { api } from "../utils/custom-axios";
import type { IPost } from "../types/post";

const posts_url = "posts";

export async function getAllPostsHandler() {
	try {
		const response = await api.get(posts_url);

		if (response.status >= 200 && response.status < 300) {
			return response.data.posts ?? response.data.data ?? response.data;
		}

		throw new Error(response?.data.message ?? "Something went wrong");
	} catch (error: any) {
		if (error.response) {
			throw {
				message: error.response.data.error,
				errorCode: error.response.data.code,
			};
		}

		throw {
			message: error.response?.data.error ?? "Something went wrong",
		};
	}
}

export async function getPostHandler(postId: string) {
	try {
		const response = await api.get(`${posts_url}/${postId}`);

		if (response.status >= 200 && response.status < 300) {
			return response.data.data ?? response.data;
		}

		throw new Error(response?.data.message ?? "Something went wrong");
	} catch (error: any) {
		if (error.response) {
			throw {
				message: error.response.data.error,
				errorCode: error.response.data.code,
			};
		}

		throw {
			message: error.response?.data.error ?? "Something went wrong",
		};
	}
}

export async function createPostHandler(data: Omit<IPost, "id" | "date">) {
	try {
		console.log("data to be sent", data);

		const response = await api.post(posts_url, data);

		if (response.status >= 200 && response.status < 300) {
			return response.data.data ?? response.data;
		}

		throw new Error(response?.data.message ?? "Something went wrong");
	} catch (error: any) {
		if (error.response) {
			throw {
				message: error.response.data.error,
				errorCode: error.response.data.code,
			};
		}

		throw {
			message: error.response?.data.error ?? "Something went wrong",
		};
	}
}

export async function updatePostHandler(
	postId: string,
	data: Omit<IPost, "id" | "date">
) {
	try {
		console.log("data to be updated", data);

		const response = await api.put(`${posts_url}/${postId}`, data);

		if (response.status >= 200 && response.status < 300) {
			return response.data.data ?? response.data;
		}

		throw new Error(response?.data.message ?? "Something went wrong");
	} catch (error: any) {
		if (error.response) {
			throw {
				message: error.response.data.error,
				errorCode: error.response.data.code,
			};
		}

		throw {
			message: error.response?.data.error ?? "Something went wrong",
		};
	}
}

export async function deletePostHandler(postId: string) {
	try {
		const response = await api.delete(`${posts_url}/${postId}`);

		if (response.status >= 200 && response.status < 300) {
			return response.data.data ?? response.data ?? { success: true };
		}

		throw new Error(response?.data.message ?? "Something went wrong");
	} catch (error: any) {
		if (error.response) {
			throw {
				message: error.response.data.error,
				errorCode: error.response.data.code,
			};
		}

		throw {
			message: error.response?.data.error ?? "Something went wrong",
		};
	}
}
