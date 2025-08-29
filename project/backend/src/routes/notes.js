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

import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Admin routes
router.get("/admin",authenticate, authorize(["ADMIN"]), getNotes);
router.get("/admin/:id", authenticate, authorize(["ADMIN"]), validateNoteId, getNoteById);
router.put("/admin/:id", authenticate, authorize(["ADMIN"]), validateNoteId, updateNoteValidator, updateNote);
router.delete("/admin/:id", authenticate, authorize(["ADMIN"]), validateNoteId, deleteNote);


//user routes
router.get("/",authenticate, getNotes);
router.get("/:id",authenticate, validateNoteId, getNoteById);
router.post("/",authenticate, createNoteValidator, createNote);
router.put("/:id",authenticate, validateNoteId, updateNoteValidator, updateNote);
router.delete("/:id",authenticate, validateNoteId, deleteNote);



export default router;
