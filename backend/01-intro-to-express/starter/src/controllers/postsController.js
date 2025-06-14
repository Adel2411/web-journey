import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  res.json(posts);
};

export const getPostById = (req, res) => {
  const Id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === Id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  } 
  res.json(post);
  }
