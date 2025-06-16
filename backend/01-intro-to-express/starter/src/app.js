import express from "express";
import { router } from "./routes/posts.js";

const PORT = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/posts", router);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
