import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from './routes/notes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/notes", notesRouter);

app.get("/", (_, res) => {
  res.json({ message: "CollabNote API is running!" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`CollabNote API server is running on http://localhost:${PORT}`);
});
