import express from "express";
const router = express.Router();
import * as noteController from "../controllers/noteController.js";
import {
  validateNoteId,
  validateNoteData,
} from "../middleware/validationMiddleware.js";
import { requestLogger } from "../middleware/loggingMiddleware.js";

// Apply logging middleware to all routes
router.use(requestLogger);

// GET /api/notes – get all notes
router.get("/", noteController.getAllNotes);

// GET /api/notes/:id – get note by ID
router.get("/:id", validateNoteId, noteController.getNoteById);

// POST /api/notes – create new note
router.post("/", validateNoteData, noteController.createNote);

// PUT /api/notes/:id – update note
router.put("/:id", validateNoteId, validateNoteData, noteController.updateNote);

// DELETE /api/notes/:id – delete note
router.delete("/:id", validateNoteId, noteController.deleteNote);

export default router;
