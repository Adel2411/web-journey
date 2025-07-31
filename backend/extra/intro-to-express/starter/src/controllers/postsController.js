import posts from"../data/posts.js";

// get all the posts
export function getAllPosts (req, res)  {
  res.status(200).json(posts);
}

// get a post by its ID
export function getPostsByID (req,res) {
  const post = posts.find(p=>p.id ===parseInt(req.params.id));
  if (!post) return res.status(404).json({message:'post not found'});
  res.status(200).json(post);
}

// create a new post
export function createPost  (req,res) {
const{title,content} = req.body;
const newpost = {
  id : posts.length + 1 ,
  title,
  content 
}
posts.push(newpost);
res.status(201).json(newpost);
}

// update a post
export function updatepost  (req,res)  {
const post = posts.find(p=>p.id ===parseInt(req.params.id));
if (!post) return res.status(404).json({message:'post not found'});
const{title,content} = req.body;
post.title = title || post.title;
post.content = content || post.content;
res.status(200).json(post);
}

// delete a post
export function deletepost  (req,res) {
  const post = posts.find(p=>p.id ===parseInt(req.params.id));
  if(!post) return res.status(404).json({message: 'post not found'});
  const index = posts.indexOf(post);
  posts.splice(index,1);
  res.status(200).json({message: 'post deleted'});
}
