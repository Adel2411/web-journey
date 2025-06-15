import posts from "../data/posts.js";

// return all posts 
export const getPosts = (req, res) => {
  res.status(200).json(posts);
};

// return post by id
export const getPostById = (req, res) => {
 const wantedId = parseInt(req.params.id); 
 const wantedPost = posts.find(post => post.id === wantedId); 

  if (!wantedPost) {
    return res.status(404).json({ message: `Post with ID ${wantedId} does not exist` }); 
  }
 res.status(200).json(wantedPost); 
};

// return post by author's name
export const filterPostsByAuthor = (req, res) => {

 const author = req.query.author?.toLowerCase();

  if (!author) {
    return getPosts(req, res); 
  }

  const filteredPosts = posts.filter(
    post => post.author.toLowerCase() === author
  )

  if (filteredPosts.length === 0) {
    return res.status(404).json({ message: `No posts found by author "${author}"` });
  }

  res.status(200).json(filteredPosts);
};

// create a post 
export const createPost = (req, res) => {

const { title, content, author, createdAt, updatedAt } = req.body;
const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
const newId = maxId + 1;

const newPost = {
  id: newId,
  title,
  content,
  author,
  createdAt,
  updatedAt,
};

posts.push(newPost);

res.status(201).json({
  message: "New post has been created successfully.",
  post: newPost
});

};

// update post 
export const updatePost = (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);

  if (!post) {
    return res.status(404).json({ message: `Post with ID ${postId} not found.` });
  }

  const { title, content, author } = req.body;

  if (title) post.title = title;
  if (content) post.content = content;
  if (author) post.author = author;

  post.updatedAt = new Date().toISOString(); 

  res.status(200).json({
    message: `Post with ID ${postId} has been updated.`,
    post
  });
};

// delete post 
export const deletePost = (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex(post => post.id === postId);

  if (index === -1) {
    return res.status(404).json({ message: `Post with ID ${postId} not found.` });
  }

  const deletedPost = posts.splice(index, 1)[0]; 

  res.status(200).json({
    message: `Post with ID ${postId} has been deleted.`,
    post: deletedPost
  });
};
