import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
