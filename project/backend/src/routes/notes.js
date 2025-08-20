import express from "express";
import auth from "../middleware/auth.js";
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

router.get("/", auth, getNotes);
router.get("/:id", auth, validateNoteId, getNoteById);
router.post("/", auth, createNoteValidator, createNote);
router.put("/:id", auth, validateNoteId, updateNoteValidator, updateNote);
router.delete("/:id", auth, validateNoteId, deleteNote);

export default router;
