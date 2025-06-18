import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  res.json(posts);
};

export const getPostById = (req, res) => {
  const id = parseInt(req.params.id);
  // the loop that reaches the post with the id demandé
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
};

export const getPostsByAuthor = (req, res) => {
  const { author } = req.query; // récupérer the author
  if(!author) {
    return res.status(400).json({ error: "Author quer parameter is required"});
  }
  //filter les posts by author name
  const filtre = posts.filter( (post) => post.author.toLowerCase() === author.toLowerCase());
  res.json(filtre);
};

export const createPost = (req, res) => {
  const { title, content, author, createdAt, updatedAt } = req.body;
  // generte unique ID
  const id = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
  //creating the post 
  const newPost = { id, title, content, author, createdAt, updatedAt };
  posts.push(newPost); 
  res.status(201).json(newPost); // return post created
};

export const updatePost = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, author, updatedAt}  = req.body;
  // to find the post by it's ID
  const post = posts.find(p => p.id === id);
  // if the post doesn't exist 
  if(!post) {
    return res.status(404).json({ error: "Post not found"});
  }
  // to update the provided fields 
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (author !== undefined) post.author = author;
  post.updatedAt = updatedAt; // new date 
  res.json(post); // return the updated post
};

export const deletePost = (req, res) => {
  const id = parseInt(req.params.id); // récupéreré l'ID
  const index = posts.findIndex(p => p.id === id); // to find the index of the post 
  // if not found
  if(index === -1) {
    return res.status(404).json({ error: "Post not found"});
  }
  // remove the post from the array
  posts.splice(index, 1);
  // retourne un message de succes
  res.status(200).json({ message: `Post ${id} deleted successfully`});
};