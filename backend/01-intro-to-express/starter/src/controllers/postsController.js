import posts from "../data/posts.js";

/**
 * GET /posts
 * Return all blog posts or filter by author (if ?author= query is present)
 */
export const getAllPosts = (req, res) => {
  const { author } = req.query;

  // If query param ?author=name is present, filter by author
  if (author) {
    const filteredPosts = posts.filter((post) =>
      post.author.toLowerCase().includes(author.toLowerCase())
    );
    return res.json(filteredPosts);
  }

  // Otherwise, return all posts
  res.json(posts);
};

/**
 * GET /posts/:id
 * Return a single blog post by its ID
 */
export const getPostById = (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
};

/**
 * POST /posts
 * Create a new blog post
 * Middleware should validate and add timestamps
 */
export const createPost = (req, res) => {
  const { title, content, author, createdAt, updatedAt } = req.body;

  const newPost = {
    id: posts.length + 1, // generate new ID
    title,
    content,
    author,
    createdAt,
    updatedAt,
  };

  posts.push(newPost); // add to the array
  res.status(201).json(newPost); // return the created post
};

/**
 * PUT /posts/:id
 * Edit an existing blog post by ID
 * Only updates provided fields and updates updatedAt
 */
export const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content, author, updatedAt } = req.body;

  const postIndex = posts.findIndex((p) => p.id === parseInt(id));
  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  const postToUpdate = posts[postIndex];

  // Only update fields if they are provided
  if (title) postToUpdate.title = title;
  if (content) postToUpdate.content = content;
  if (author) postToUpdate.author = author;

  // Always update the updatedAt timestamp
  postToUpdate.updatedAt = updatedAt;

  res.json(postToUpdate);
};

/**
 * DELETE /posts/:id
 * Delete a blog post by ID
 */
export const deletePost = (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === parseInt(id));

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Remove post from the array
  const deleted = posts.splice(postIndex, 1);
  res.json({ message: "Post deleted", post: deleted[0] });
};
