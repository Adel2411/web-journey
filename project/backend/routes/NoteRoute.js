import express from 'express';

const router = express.Router();
import { getNotes,postNotes } from '../controller/NoteController.js';
import { createNoteValidator } from '../middelware/validation.js';

router.get('/',getNotes);
router.post('/add',createNoteValidator,postNotes);

export default router;