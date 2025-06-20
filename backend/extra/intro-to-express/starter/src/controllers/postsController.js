import posts, { getNextId } from '../data/posts.js';

export const getAllPosts = (req, res) => {
  const { author } = req.query;

  if (author) {
    const filteredPosts = posts.filter(post => 
      post.author.toLowerCase().includes(author.toLowerCase())
    );
    return res.json(filteredPosts);
  }

  res.json(posts);
};

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