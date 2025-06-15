import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  res.status(201).json(posts);
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

export const postCreateBlogPost  = (req, res) => {
  const post = req.body;
  const existBlogPost = posts.find((p) => p.title === post.title && p.author === post.author);

  if (existBlogPost) {
    return res.status(409).json({ message: 'Blog Post already exists' });
  } 

  const newBlogPost = {
    id: posts.length + 1,
    title: post.title,
    content: post.content,
    author: post.author,
    createdAt: new Date().toISOString(),
  };
  posts.push(newBlogPost);
  
  res.status(201).json({ message: "Blog post created successfully", post: newBlogPost });
}

export const putUpdateBlogPostById = (req, res) => {
  const Id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === Id);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  const { title, content, author} = req.body; 
  post.title = title;
  post.content = content;
  post.author = author;
  post.createdAt = new Date().toISOString();

  res.json({ message: "Blog post updated successfully", post });
}

export const deleteBlogPostById = (req, res) => {
  const Id = parseInt(req.params.id);
  const post = posts.findIndex((p) => p.id === Id);

  if (post === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  posts.splice(post, 1); // Remove the post from the array

  res.json({ message: "Blog post deleted successfully", postId: Id });
  
}