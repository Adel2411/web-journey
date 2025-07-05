import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notesController.js";

const router = express.Router();

//GET /api/notes 
router.get("/", getAllNotes);

// GET /api/notes/:id
router.get("/:id", getNoteById);

//PUT /api/notes/:id
router.put("/:id", updateNote);

//POST /api/notes
router.post("/", createNote);

//DELETE /api/notes/:id
router.delete("/:id", deleteNote);

export default router;