import posts from "../data/posts.js";


// Return all blog posts
export const getPosts = (req, res) => {
  let result = posts;
  if (req.query.author) {
    result = result.filter(post => post.author === req.query.author);
  }
  res.status(200).json(result);
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




//Create a new blog post
export const createPost=(req,res)=>{
  const post = {
    id : posts.length +1,
    title : req.body.title,
    content : req.body.content,
    author : req.body.author,
    createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
  post.updatedAt = req.body.updatedAt;
  
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