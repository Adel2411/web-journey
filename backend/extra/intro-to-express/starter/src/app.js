import express from "express";
import postRoutes from "./routes/posts.js";
import logger from "./middleware/logger.js";
import addTimestamp  from "./middleware/timestamp.js";

const PORT = 3000;
const app = express();

app.use(express.json());

// middlewares
app.use(logger);
app.use(addTimestamp);

app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});