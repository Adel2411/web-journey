// load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// import express and other dependencies
import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.js";

const app = express();

//to set port from .env or use 3000 by default
const PORT = process.env.PORT || 3000;

//allow frontend to access this backend (CORS)
app.use(
    cors({
        origin: "http://localhost:5173", //CORS pour vite frontend
        credentials: true,
    })
);

//allow JSON request bodies
app.use(express.json());

// test route 
app.get("/", (_, res) => {
  res.send("Hello, World!");
});

// notes api routes
app.use("/api/notes", notesRouter);

//global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!"});
});

//start the server 
app.listen(PORT, () => {
    console.log(`CollabNotes API server is running on http://localhost:${PORT}`);
});
