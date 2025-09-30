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
} from "../middleware/validator.js";

import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", authenticate, getNotes);
router.get("/:id", authenticate, validateNoteId, getNoteById);
router.post("/", authenticate, createNoteValidator, createNote);
router.put("/:id", authenticate, validateNoteId, updateNoteValidator, updateNote);
router.delete("/:id", authenticate, validateNoteId, deleteNote);

export default router;
