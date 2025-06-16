import express from "express";
import { routes } from "./routes/posts.js";
import postsData from "./data/posts.js"
import logger from "./middleware/logger.js";
import { postValidator, putValidator } from "./middleware/validation.js";
import { addTime } from "./middleware/timesatamp.js";

const PORT = 3000;
const app = express();

app.use(express.json());

// middlewares
app.use(logger)
app.use(addTime)
app.use("/posts", routes);


//Return all blog posts

routes.get('/posts', (req, res) => {
  const dataPost = postsData.posts.find((post) => {
    return post
  })

  res.status(200).json(dataPost)
})


//Return a single blog post by ID

routes.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const post = postsData.posts.find((post) => {
    if(post.id === id){
      return post
    }
  })

  res.status(200).json(post)
})

//Return posts by specific author


routes.get('/author/:name', (req, res) =>{
  const name = req.params.name

  const post = postsData.posts.find((post) => {
    if(post.author === name){
      return post
    }
  })

  res.status(200).json(post)
})

//Create a new blog post

routes.post('/',postValidator,addTime, (req, res) =>{
  const post = req.body

  postsData.posts.push(post)

  res.status(201).json(postsData.posts)
})

//Update a blog post by ID


routes.put('/:id',putValidator, addTime, (req, res) =>{
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
})


//Delete a blog post by ID

routes.delete('/:id', (req, res) =>{
  const id = parseInt(req.params.id)

  const filteredData = postsData.posts.filter( post => post.id != id)
  postsData.posts = filteredData

  res.status(200).json(filteredData)

})


app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
