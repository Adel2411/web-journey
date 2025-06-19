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
export const addPost = (req, res) => {
  try {
    const { title, author, content } = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({ error: "Title, author, and content are required" });
    }

    const newPost = {
      id: posts.length + 1,
      title,
      author,
      content,
      createdAt: req.createdAt,
    };

    posts.push(newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in addPost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
  res.status(201).json({message :"Post updated with success! "});
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

export function getPostByAuthor(req, res) {
  const au = req.params.author;

  const author = typeof au === "string" ? au : String(rawAuthor || "");

  const filteredPosts = posts.filter(post =>
    typeof post.author === "string" && post.author.toLowerCase() === author.toLowerCase()
  );

  if(filteredPosts.length===0){
    res.status(404).json({message: "Author not found !!"});
  }else{
    res.json(filteredPosts);
  }
}