import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import NoteRoute from '../routes/NoteRoute.js';
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL||"http://localhost:5173",

}));
app.use("/api/notes",NoteRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
