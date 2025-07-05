import express from "express";
import { getAllNotes, getNoteById } from "../controllers/notesController.js";

const router = express.Router();

//GET /api/notes 
router.get("/", getAllNotes);

// GET /api/notes/:id
router.get("/:id", getNoteById);

export default router;