import { get } from "http";
import posts from "../data/posts.js";
import { create } from "domain";

export const getPosts = (req, res) => {

  const { author } = req.query;

  if (author) {
      const filteredPosts = posts.filter(post => post.author.toLowerCase() === author.toLowerCase());
      
      if(filteredPosts.length === 0){
        return res.status(404).json({error : "there is no posts for this author"})
      }
      return res.status(202).json(filteredPosts)
    }
  
  res.json(posts);
};

export const getPostById = (req, res) => {
  const { id } = req.params;
  const post = posts.find( p => p.id === parseInt(id));
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  
  res.status(200).json(post);
}

export const createPost = (req, res) => {
  const { title, content, author } = req.body;

  const newPost = {
    id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    title,
    content,
    author,
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);
  res.status(201).json(newPost);
}

export const putPostById = (req, res) => {
  const { id } = req.params;  
  const postIndex = posts.findIndex(p => p.id === parseInt(id));

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  return res.status(200).json({
    message: "Post updated successfully",
    post: posts[postIndex],
  });
};

export const deletePostById = (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(p => p.id === parseInt(id));
  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  // we cant reassigne so we use splice 
  posts.splice(postIndex, 1);

  res.status(200).json({
    message: "Post deleted successfully",
    posts: posts
  });

}