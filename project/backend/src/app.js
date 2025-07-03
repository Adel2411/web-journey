import express from "express";
import { PrismaClient } from './generated/prisma/index.js';
import dotenv from "dotenv";
import cors from "cors";
import notesRouter from "./routes/notes.js";


dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
)

app.get("/", (_, res) => {
  res.json({ message: "CollabNote API is running!" });
});


app.use("/api/notes", notesRouter);

app.use((err, req, res, next) => {

  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });

})


app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
