import posts from "../data/posts.js";


// Return all blog posts
export const getPosts = (req, res) => {
  res.status(200).json(posts);
};

// Return a single blog post by ID 
export const getPostById = (req, res)=>{
   const id = parseInt(req.params.id);
 const post = posts.find(p => p.id === id);
 if(!post){
  res.status(404).json({
    message: "Post not found" });
 }
      
     res.status(200).json(post);
     return post ;
}

//Filter blog posts by author
export const getPostByauthor = (req,res)=>{
  const Author = posts.filter(p=> p.author.toLowerCase() ===req.params.author.toLowerCase() )
  if(Author.length===0){
    res.status(404).json({
    message: "author not found" });
  }
  res.status(200).json(Author);
}


//Create a new blog post
export const createPost=(req,res)=>{
  const post = {
    id : posts.length +1,
    title : req.body.title,
    content : req.body.content,
    author : req.body.author,
    createdAt : new Date().toISOString()
  }
  posts.push(post);
  res.status(201).json({
    message: "Post created successfully",
    post: post
  });
}


//Edit a blog post
export const updatePost = (req,res)=>{
  const id = parseInt(req.params.id);
const post = posts.find(p => p.id === id)
  if(!post){
    return res.status(404).json({
      message: "Post not found"
    });
  }
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.author = req.body.author || post.author;
  
  res.status(200).json({
    message: "Post updated successfully",
    post: post
  });
}


// Delete a blog post
export const deletePost = (req,res) =>{
 
    const id = parseInt(req.params.id)
    const index = posts.findIndex(p => p.id === id);
    if(index.length === -1){
      return res.status(404).json({
        message: "Post not found"
      });
    }
    posts.splice(index, 1);
     res.status(200).json({
        message: "Post deleted successfully"
    });

}