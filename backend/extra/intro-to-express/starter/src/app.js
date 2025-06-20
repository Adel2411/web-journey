import express from "express";
import { routes } from "./routes/posts.js";
import logger from "./middleware/logger.js";
import { addTime } from "./middleware/timesatamp.js";

const PORT = 3000;
const app = express();
 

app.use(express.json());

// middlewares
app.use(logger)
app.use(addTime)
app.use("/posts", routes);



app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});