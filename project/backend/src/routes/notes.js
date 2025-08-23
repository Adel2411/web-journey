import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
import {
  createNoteValidator,
  updateNoteValidator,
  validateNoteId,
} from "../utils/noteValidator.js";
//  NEW: import your auth middleware
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

//  Apply authentication to ALL note routes
router.use(authenticate);

router.get("/", getNotes);
router.get("/:id", validateNoteId, getNoteById);
router.post("/", createNoteValidator, createNote);
router.put("/:id", validateNoteId, updateNoteValidator, updateNote);
router.delete("/:id", validateNoteId, deleteNote);

export default router;
