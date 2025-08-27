import express from "express";
import { authenticate } from "../middleware/auth.js";

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
} from "../middleware/validator.js";

const router = express.Router();

router.use(authenticate);

// Routes (all require JWT now)
router.get("/", getNotes);
router.get("/:id", validateNoteId, getNoteById);
router.post("/", createNoteValidator, createNote);
router.put("/:id", validateNoteId, updateNoteValidator, updateNote);
router.delete("/:id", validateNoteId, deleteNote);

export default router;
