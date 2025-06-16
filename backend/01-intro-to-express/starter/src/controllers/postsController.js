import posts from "../data/posts.js";

// Initialize nextId based on the current posts
// If there are no posts, start with 1
let nextId =
  posts.length > 0 ? Math.max(...posts.map((p) => Number(p.id))) + 1 : 1;

export const getPosts = (req, res) => {
  const author = req.query.author;

  // If an author is specified, filter posts by that author
  if (author) {
    const filteredPosts = posts.filter(
      (p) => p.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredPosts.length === 0) {
      return res.status(404).json({
        message: `No posts found for author '${author}'`,
      });
    }

    return res.status(200).json(filteredPosts);
  }

  if (posts.length === 0) {
    return res.status(404).json({ message: "No posts available." });
  }

  res.status(200).json(posts);
};

export const getPostById = (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res
      .status(404)
      .json({ message: `Post with ID ${req.params.id} not found.` });
  }

  res.status(200).json(post);
};

export const createPost = (req, res) => {
  const { title, content, author, createdAt, updatedAt } = req.body;

  const newPost = {
    id: nextId++,
    title,
    content,
    author,
    createdAt: createdAt || new Date().toISOString(),
    updatedAt: updatedAt || new Date().toISOString(),
  };

  posts.push(newPost);
  res.status(201).json(newPost);
};

export const modifyPost = (req, res) => {
  const postId = Number(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res
      .status(404)
      .json({ message: `Post with ID ${req.params.id} not found.` });
  }

  const { title, content, author, updatedAt } = req.body;

  const updatedPost = {
    ...posts[postIndex], //keeping the id and createdAt fields intact
    //if the field is not provided, keep the original value
    title: title ?? posts[postIndex].title,
    content: content ?? posts[postIndex].content,
    author: author ?? posts[postIndex].author,
    updatedAt: updatedAt || new Date().toISOString(),
  };

  posts[postIndex] = updatedPost;
  res.status(200).json(updatedPost);
};

export const deletePost = (req, res) => {
  const postId = Number(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res
      .status(404)
      .json({ message: `Post with ID ${req.params.id} not found.` });
  }

  posts.splice(postIndex, 1);
  res.status(200).json({ message: `Post with ID ${req.params.id} deleted.` });
};
