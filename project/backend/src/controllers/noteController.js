import { handleError } from "../utils/errors.js";
import * as noteService from "../services/noteService.js";

// GET /notes
const getAllNotes = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sort = "newest" } = req.query;
    
    const result = await noteService.getAllNotes(search, page, limit, sort);
    
    if (!result.notes.length) {
      return res.status(404).json({ success: false, error: "No notes found." });
    }

    return res.json({
      success: true,
      notes: result.notes,
      pagination: result.pagination
    });
  } catch (err) {
    handleError(res, err, "Failed to retrieve notes");
  }
};

// GET /notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.noteId);

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    return res.json({ success: true, note });
  } catch (err) {
    handleError(res, err, "Failed to retrieve note");
  }
};

// POST /notes
const createNote = async (req, res) => {
  try {
    const newNote = await noteService.createNote(req.validatedNote);

    return res.status(201).json({
      success: true,
      note: newNote,
    });
  } catch (err) {
    handleError(res, err, "Failed to create note");
  }
};

// PUT /notes/:id
const updateNote = async (req, res) => {
  try {
    const updatedNote = await noteService.updateNote(req.noteId, req.validatedNote);

    if (!updatedNote) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    return res.status(200).json({
      success: true,
      note: updatedNote,
    });
  } catch (err) {
    handleError(res, err, "Failed to update note");
  }
};

// DELETE /notes/:id
const deleteNote = async (req, res) => {
  try {
    const deleted = await noteService.deleteNote(req.noteId);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    return res.json({
      success: true,
      message: "Note deleted successfully.",
    });
  } catch (err) {
    handleError(res, err, "Failed to delete note");
  }
};

export {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
