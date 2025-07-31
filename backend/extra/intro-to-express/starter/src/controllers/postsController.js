const posts = require('../data/posts');

// get all the posts
exports.getAllPosts = (req, res) => {
  res.status(200).json(posts);
};

// get a post by its ID
exports.getPostsbyID = (req,res) =>{
  const post = posts.find(p=>p.id ===parseInt(req.params.id));
  if (!post) return res.status(404).json({message:'post not found'});
  res.status(200).json(post);
};

// create a new post
exports.createpost = (req,res) =>{
const{title,content} = req.body;
const newpost = {
  id : post.lenght + 1 ,
  title,
  content 
};
posts.push(newpost);
res.status(201).json(newpost);
};

// update a post
exports.updatepost = (req,res) => {
const post = posts.find(p=>p.id ===parseInt(req.params.id));
if (!post) return res.status(404).json({message:'post not found'});
const{title,content} = req.body;
post.title = title || post.title;
post.content = content || post.content;
res.status(200).json(post);
};

// delete a post
exports.deletepost = (req,res) => {
  const post = posts.find(p=>p.id ===parseInt(req.params.id));
  if(!post) return res.status(404).json({message: 'post not found'});
  const index = posts.indexOf(post);
  posts.splice(index,1);
  res.status(200).json({message: 'post deleted'});
};
