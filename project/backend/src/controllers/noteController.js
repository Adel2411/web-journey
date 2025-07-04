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
    const { search = "", page = 1, limit = 10, sort = "newest" } = req.query;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    // Build filtering condition
    const where = search.trim()
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Sorting logic
    let orderBy;
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "az":
        orderBy = { title: "asc" };
        break;
      case "za":
        orderBy = { title: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
    }

    const [notes, totalCount] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.note.count({ where }),
    ]);

    if (!notes.length) {
      return res.status(404).json({ error: "No notes found." });
    }

    res.json({
      notes: notes.map(formatNote),
      pagination: {
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
      },
    });
  } catch (err) {
    console.error("Get all notes error:", err);
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
