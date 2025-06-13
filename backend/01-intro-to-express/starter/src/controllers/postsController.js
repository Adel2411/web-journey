import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  
  res.status(200).json(posts);
};

export const getPostById=(req,res)=>{
  const id=parseInt(req.params.id);
  console.log(id)

  const post=posts.find((post)=>{
    return post.id===id;

  })
  if(!post){
    return res.status(404).json({ message: "Post not found" });
  }else{
    res.status(200).json(post);
  }
}
export const createPost=(req, res) => {
  const post=req.body 
  console.log(post)
  posts.push(post)
  console.log(posts)
  res.status(201).json({ message: "Post created successfully", post });

}
export const updatePostById=(req,res)=>{
  const id=parseInt(req.params.id)
  const updatedPost=req.body
  console.log(updatedPost)
  const indexPost=posts.findIndex((post)=>post.id===id)
  if (indexPost === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  posts[indexPost]={...posts[indexPost],
    ...updatedPost,
    id}
  console.log(posts)
  res.status(200).json({ message: "Post updated successfully", updatedPost });
}

export const deletePostById=(req,res)=>{
  const id=parseInt(req.params.id)
  const indexPost=posts.findIndex((post)=>post.id===id)
  if (indexPost === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  posts.splice(indexPost, 1);
 
  res.status(200).json({ message: "Post deleted successfully" });
}