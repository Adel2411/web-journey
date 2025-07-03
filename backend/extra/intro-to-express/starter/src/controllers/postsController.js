import postsData from "../data/posts.js";

export const getPosts = (req, res) => {

  const author = req.query.author;

  if (!author) {
    res.status(200).json(postsData.posts);
  }
  console.log("author from query:", author);
  const filtered = postsData.posts.filter(
    (post) => post.author.toLowerCase() === author.toLowerCase()
  );
  console.log(filtered)
  res.status(200).json(filtered);
};

//Return a single blog post by ID

export const getPostById = (req, res) => {
  const id = parseInt(req.params.id);

  const post = postsData.posts.find((post) => {
    return post.id === id;
  });


  res.status(200).json(post)
};

//Create a new blog post

export const creatPost = (req, res) =>{
  const post = req.body

  postsData.posts.push(post)

  res.status(201).json(postsData.posts)
};

//Update a blog post by ID


export const updatPost  = (req, res) =>{
  const id = parseInt(req.params.id)

  const updatedPost = postsData.posts.find((post) => {

    if( post.id === id ){
      post.id = req.body.id
      post.author = req.body.author
      post.title = req.body.title
      post.content = req.body.content
      post.createdAt = req.body.createdAt
      post.updatedAt = req.body.updatedAt
      return post
    }
  }) 

  res.status(200).json(postsData.posts)
};


//Delete a blog post by ID

export const deletPost = (req, res) =>{
  const id = parseInt(req.params.id)

  const filteredData = postsData.posts.filter( post => post.id != id)
  postsData.posts = filteredData

  res.status(200).json(filteredData)

};



