import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandling from "./middleware/errorHandling.js";
import notesRouter from "./routes/notes.js";
import prisma from "./prisma-client.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/notes", notesRouter);
app.use(errorHandling);

const server = async () => {
  try {
    await prisma.$connect();
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => {
      console.log(`Server is running on localhost:${port}`);
    });
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};
server();
