import express from 'express';
import logger from './middleware/logger.js';
import postsRouter from './routes/posts.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);


app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Mini Blog API!",
    endpoints: {
      "GET /posts": "Get all posts",
      "GET /posts?author=name": "Get posts by author",
      "GET /posts/:id": "Get post by ID",
      "POST /posts": "Create new post",
      "PUT /posts/:id": "Update post by ID",
      "DELETE /posts/:id": "Delete post by ID"
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.method} ${req.originalUrl} does not exist`
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong!"
  });
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

export default app;