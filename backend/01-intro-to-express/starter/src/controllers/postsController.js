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

export const getPostByAuthor = (req, res) => {
  const author = req.params.author;
  const post = posts.find((p) => p.author.toLowerCase() === author.toLowerCase());
  if(!post) {
    return res.status(404).json({ error: "No post found with this name of author"});
  }
  res.json(post);
}
