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
  console.log("author:", author)
  const result = posts.filter(post => post.author === author);
  res.status(200).json(result)
}

export const createPost = (req, res) => {
    const post = req.body
    posts.push(post)
    console.log(posts)

    res.status(201).json(posts)
}


export const updatePost = (req, res) => {
    const post = req.body
    const id = parseInt(req.params.id);

    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Post not found" });
    }

    const { title, content, author, updatedAt } = req.body;
    if (title) posts[index].title = title;
    if(content) posts[index].content = content;
    if(author) posts[index].author = author;
    posts[index].updatedAt = updatedAt;

    res.status(200).json(posts);
}

export const deletePost = (req, res) => {
    const id = parseInt(req.params.id)

    const index = posts.findIndex((post) => post.id === id);
    posts.splice(index, 1);
    res.status(200).json(posts)
}