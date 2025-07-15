
import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../Controllers/notesController.js';

import {
  createNoteValidator,
  updateNoteValidator,
  validateNoteId,
} from '../utils/noteValidator.js';

const router = express.Router();

router.get('/', getNotes);
router.get('/:id', validateNoteId, getNoteById);
router.post('/', createNoteValidator, createNote);
router.put('/:id', validateNoteId, updateNoteValidator, updateNote);
router.delete('/:id', validateNoteId, deleteNote);

export default router;
