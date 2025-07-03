
import express from "express";
import postsRoutes from "./routes/posts.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON parsing
app.use(express.json());

// Main route for blog posts
// on d'autre term : "For any request that starts with /posts, use the routes defined in postsRoutes."
app.use("/posts", postsRoutes);


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
