import { prisma } from "../app.js";

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

// Get all notes with filtering, pagination and sorting
const getAllNotes = async (search = "", page = 1, limit = 10, sort = "newest") => {
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

  return {
    notes: notes.map(formatNote),
    pagination: {
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(totalCount / take),
      totalCount,
    },
  };
};

// Get note by ID
const getNoteById = async (id) => {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  return note ? formatNote(note) : null;
};

// Create a new note
const createNote = async (noteData) => {
  const newNote = await prisma.note.create({
    data: {
      title: noteData.title,
      content: noteData.content,
      authorName: noteData.authorName,
      isPublic: noteData.isPublic ?? true,
    },
  });

  return formatNote(newNote);
};

// Update an existing note
const updateNote = async (id, noteData) => {
  // First check if note exists
  const existingNote = await prisma.note.findUnique({ where: { id } });
  
  if (!existingNote) {
    return null;
  }

  const updatedNote = await prisma.note.update({
    where: { id },
    data: {
      title: noteData.title,
      content: noteData.content,
      authorName: noteData.authorName,
      isPublic: noteData.isPublic,
      updatedAt: new Date(),
    },
  });

  return formatNote(updatedNote);
};

// Delete a note
const deleteNote = async (id) => {
  // First check if note exists
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    return false;
  }

  await prisma.note.delete({
    where: { id },
  });

  return true;
};

export {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  formatNote,
};