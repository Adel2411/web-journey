import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { handleError } from "../utils/errors.js";
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

// GET /notes
// Query Parameters:
// - search (string, optional): Filters notes where the title or content includes this string (case-insensitive).
// - page (number, optional, default = 1): Specifies the page number for pagination.
// - limit (number, optional, default = 10): Specifies how many notes to return per page.
// - sort (string, optional, default = "newest"): Controls sorting.
//     Options:
//       - "newest": Sort by creation date (newest first).
//       - "oldest": Sort by creation date (oldest first).
//       - "az": Sort by title alphabetically A–Z.
//       - "za": Sort by title alphabetically Z–A.
const getAllNotes = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sort = "newest" } = req.query;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where = search.trim()
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const orderBy = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      az: { title: "asc" },
      za: { title: "desc" },
    }[sort] || { createdAt: "desc" };

    const [notes, totalCount] = await Promise.all([
      prisma.note.findMany({ where, orderBy, skip, take }),
      prisma.note.count({ where }),
    ]);

    if (!notes.length) {
      return res.status(404).json({ success: false, error: "No notes found." });
    }

    return res.json({
      success: true,
      notes: notes.map(formatNote),
      pagination: {
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
      },
    });
  } catch (err) {
    handleError(res, err, "Failed to retrieve notes");
  }
};

// GET /notes/:id
const getNoteById = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.noteId },
    });

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    return res.json({ success: true, note: formatNote(note) });
  } catch (err) {
    handleError(res, err, "Failed to retrieve note");
  }
};

// POST /notes
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

    return res.status(201).json({
      success: true,
      note: formatNote(newNote),
    });
  } catch (err) {
    handleError(res, err, "Failed to create note");
  }
};

// PUT /notes/:id
const updateNote = async (req, res) => {
  const id = req.noteId;
  const { title, content, authorName, isPublic } = req.validatedNote;

  try {
    const existingNote = await prisma.note.findUnique({ where: { id } });

    if (!existingNote) {
      return res.status(404).json({ success: false, error: "Note not found." });
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

    return res.status(200).json({
      success: true,
      note: formatNote(updatedNote),
    });
  } catch (err) {
    handleError(res, err, "Failed to update note");
  }
};

// DELETE /notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.noteId },
    });

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found." });
    }

    await prisma.note.delete({
      where: { id: req.noteId },
    });

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
  formatNote,
};
