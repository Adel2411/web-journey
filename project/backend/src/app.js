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
app.use("/api/note",NoteRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
