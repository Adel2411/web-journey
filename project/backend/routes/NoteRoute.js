import express from 'express';

const router = express.Router();
import { getNotes,postNotes ,getNoteById,editNote,deleteNote} from '../controller/NoteController.js';
import { createNoteValidator ,updateValidator } from '../middelware/validation.js';

router.get('/',getNotes);
router.post('/',createNoteValidator,postNotes);
router.get("/:id",getNoteById);
router.put("/:id",updateValidator,editNote);
router.delete("/:id",deleteNote);
export default router;