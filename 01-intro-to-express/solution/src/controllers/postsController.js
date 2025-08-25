import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  res.json(posts);
};
