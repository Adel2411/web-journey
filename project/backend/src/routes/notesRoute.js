import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  unshareNote,
} from "../controllers/notesController.js";
import {
  createNoteValidator,
  updateNoteValidator,
  validateNoteId,
  validateShareBody,
} from "../middleware/validateNote.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication to all note routes
router.use(authenticate);

router.get("/", getNotes);
router.get("/:id", validateNoteId, getNoteById);
router.post("/", createNoteValidator, createNote);
router.put("/:id", validateNoteId, updateNoteValidator, updateNote);
router.delete("/:id", validateNoteId, deleteNote);

// sharing endpoints
router.post("/:id/share", validateNoteId, validateShareBody, shareNote);
router.delete("/:id/share/:userId", validateNoteId, unshareNote);

export default router;
