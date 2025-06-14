import posts from "../data/posts.js";

export const getPosts = (req, res) => {
  res.json(posts);
};

export const getPostsByid = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)

    const post = posts.find((post) => {
        if (post.id === id) {
            return post
        }
    })
    res.status(200).json(post)
}

export const getPostByAuthor = (req, res) => {
  const author = req.query.author
  console.log("Function called!");
  console.log("authorrrrrrrrrrrrrrr:", author)
  const result = posts.filter(post => post.author === author);
  res.status(200).json(result)
}

export const createPost = (req, res) => {
    const post = req.body
    console.log(post)

    posts.push(post)
    console.log(posts)

    res.status(201).json(posts)
}


export const updatePost = (req, res) => {
    const post = req.body
    const id = post.id
    console.log(post)

    const index = posts.findIndex((post) => post.id === id);

    const { title, content, author } = req.body;
    if (title) posts[index].title = title;
    if(content) posts[index].content = content;
    if(author) posts[index].author = author;

    console.log(posts)
    res.status(200).json(posts)
}

export const deletePost = (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)

    const index = posts.findIndex((post) => post.id === id);
    const result = posts.splice(index, 1);
    res.status(200).json(posts)
}
