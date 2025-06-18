import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  res.json(posts);
};

export const getPostById = (req, res) => {
  // Extract Post Id From Request Params
  const postId = parseInt(req.params.id, 10);
  // Search the Post by Id in the posts Array
  const post = posts.find(p => p.id === postId);

  // If Post Does Not Exist, Return 404
  if (!post) {
    return res.status(404).json({ message: "Post not found"});
  }
  // If Post Exists
  res.json(post);
}

export const getPostsByAuthor = (req, res) => {
  // Extract Author From Request Params
  const author = req.query.author;
  // Filter Posts by Author
  const filteredPosts = posts.filter(p => p.author === author);
  // Check Existence
  if (filteredPosts.length === 0) {
    return res.status(404).json({ message: "No posts found for this author" });
  }
  // If Posts Exist, Return Filtered Posts
  res.json(filteredPosts);
}

export const createPost = (req, res) => {
  const { title, content, author, createdAt, updatedAt } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author,
    createdAt,
    updatedAt
  };
  posts.push(newPost);
  res.status(201).json(newPost);
}

export const updatePost = (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  const { title, content, author, updatedAt } = req.body;
  const updatedPost = { ...posts[postIndex], title, content, author, updatedAt }; //Object Spread Syntax

  posts[postIndex] = updatedPost;
  res.json(updatedPost);
}