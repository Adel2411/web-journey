import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Utility to format a note
const formatNote = (note) => ({
  id: note.id,
  title: note.title,
  content: note.content,
  authorName: note.authorName,
  isPublic: note.isPublic,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (!notes || notes.length === 0) {
      return res.status(404).json({ error: "No notes found." });
    }
    res.json({ notes: notes.map(formatNote) });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve notes." });
  }
};

// Get note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.noteId },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    res.json(formatNote(note));
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve note." });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    const newNote = await prisma.note.create({
      data: {
        title: req.validatedNote.title,
        content: req.validatedNote.content,
        authorName: req.validatedNote.authorName,
        isPublic: req.validatedNote.isPublic ?? true,
      },
    });

    res.status(201).json(formatNote(newNote));
  } catch (err) {
    res.status(500).json({ error: "Failed to create note." });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.noteId },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    await prisma.note.delete({
      where: { id: req.noteId },
    });

    res.json({ message: "Note deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note." });
  }
};
// Update note
const updateNote = async (req, res) => {
  const id = req.noteId;
  const { title, content, authorName, isPublic } = req.validatedNote;

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found." });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        authorName,
        isPublic,
        updatedAt: new Date(),
      },
    });

    res.status(200).json(formatNote(updatedNote));
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update note." });
  }
};

export {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  formatNote,
};
