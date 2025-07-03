import express from 'express';

const router = express.Router();
import { getNotes,postNotes } from '../controller/NoteController.js';

router.get('/',getNotes);
router.post('/',postNotes);

export default router;