import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  res.json(posts);
};

// fnctn pour get un post par son id 
export const getPostById = (req, res)=>{
  const id = parseInt(req.params.id);
  const post = posts.find((post)=> 
  post.id === id);
  if(post){
    res.json(post);
  }else{
    res.status(404).json({message: "Post not found"});
  }
}

// fnctn pour ajouter un post 
export const addPost = (req, res)=>{

  const Id = posts.length+1;
  const {title, content, author} = req.body;
  const createdAt = req.createdAt;
  const newPost = {
    Id,
    title,
    content,
    author,
    createdAt
  };
  posts.push(newPost);
  res.status(201).json("Post created with success "+ newPost);
}

//fnctn pour faire update
export const updatePost = (req, res)=>{
  const id = parseInt(req.params.id);
  const {title, content, author} = req.body;
  const post = posts.find((post)=>{
    return post.id === id;
  })
  if(post){
    post.title = title,
    post.content = content,
    post.author = author
  }else{
    res.status(404).json({message : "Post not found !!"});
  }
  res.status(200).json({message :"Post updated with success! "});
}

//fnctn pour supp un post
export const deletePost = (req, res)=>{
  const id = parseInt(req.params.id);
  const post = posts.find((post)=>{
    return post.id === id;
  })
  if(post){
    const index = posts.indexOf(post);
    posts.splice(index,1);
    res.status(201).json({message: "Post deleted with success ! "});
  }else{
    res.status(404).json({message :"Post not found !"});
  }
}

export const getPostByAuthor = (req, res)=>{
  const {author} = req.query;
  if (!author) {
    return res.status(400).json({ error: "Author query is required" });
  }
  const filteredPosts = posts.filter(post =>
    post.author.toLowerCase() === author.toLowerCase()
  );

  if (filteredPosts.length > 0) {
    res.status(200).json(filteredPosts);
  } else {
    res.status(404).json({ message: "Author not found!" });
  }
}