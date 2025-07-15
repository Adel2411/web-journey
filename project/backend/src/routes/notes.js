import express from 'express'
import { noteValidators, validator } from '../middlewares/validation.js';
import { deleteNote, getAllNotes, createNote, getNoteById, updateNote } from '../controllers/notesController.js';

export const notesRouter = express.Router()

// get all public notes
notesRouter.get('/', getAllNotes)

//create a new note
notesRouter.post('/', noteValidators(true), validator, createNote)

// update an existing note
notesRouter.put('/:id', noteValidators(false), validator, updateNote)

// delete a note
notesRouter.delete('/:id', deleteNote)

// get a single note by id
notesRouter.get('/:id', getNoteById)


