import express from "express";
import { routes } from "./routes/posts.js";
import logger from "./middleware/logger.js";

const PORT = 3002;
const app = express();

app.use(express.json());

app.use("/posts", logger);
app.use("/posts", routes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3002");
});
