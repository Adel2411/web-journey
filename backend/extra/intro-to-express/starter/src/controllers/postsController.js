import posts, { getNextId } from '../data/posts.js';

// Get all posts or filter by author
export const getAllPosts = (req, res) => {
  const { author } = req.query;

  if (author) {
    // Filter posts by author (case-insensitive)
    const filteredPosts = posts.filter(post => 
      post.author.toLowerCase().includes(author.toLowerCase())
    );
    return res.json(filteredPosts);
  }

  // Return all posts
  res.json(posts);
};

// Get a single post by ID
export const getPostById = (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({
      error: "Post not found",
      message: `Post with ID ${id} does not exist`
    });
  }

  res.json(post);
};

// Create a new post
export const createPost = (req, res) => {
  const { title, content, author, createdAt, updatedAt } = req.body;

  const newPost = {
    id: getNextId(),
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    createdAt,
    updatedAt
  };

  posts.push(newPost);
  res.status(201).json(newPost);
};

// Update a post by ID
export const updatePost = (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      error: "Post not found",
      message: `Post with ID ${id} does not exist`
    });
  }

  const { title, content, author, updatedAt } = req.body;
  const existingPost = posts[postIndex];

  // Update only provided fields
  const updatedPost = {
    ...existingPost,
    ...(title && { title: title.trim() }),
    ...(content && { content: content.trim() }),
    ...(author && { author: author.trim() }),
    updatedAt
  };

  posts[postIndex] = updatedPost;
  res.json(updatedPost);
};

// Delete a post by ID
export const deletePost = (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      error: "Post not found",
      message: `Post with ID ${id} does not exist`
    });
  }

  const deletedPost = posts.splice(postIndex, 1)[0];
  res.json({
    message: "Post deleted successfully",
    deletedPost
  });
};