import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Prisma setup with connection check
const prisma = new PrismaClient();
let isDbConnected = true;

prisma
  .$connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    isDbConnected = false;
  });

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Block requests if DB is down
app.use((req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      error: "Database is currently unavailable.",
    });
  }
  next();
});

// Routes
app.get("/", (_, res) => {
  res.json({ message: "CollabNote API is running" });
});

app.use("/api/notes", notesRouter);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
export { prisma }; // Export Prisma client for use in controller
