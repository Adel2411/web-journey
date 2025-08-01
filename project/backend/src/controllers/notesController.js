import { prisma } from "../utils/prisma.js";
import { formatNote, formatNotes } from "../utils/noteFormatter.js";
import { httpError } from "../utils/errorHandler.js";

// GET /api/notes with search, sort, pagination
export async function getNotes(req, res, next) {
  try {
    const { search = "", sort = "newest", page = 1, limit = 3 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "title_asc"
        ? { title: "asc" }
        : sort === "title_desc"
        ? { title: "desc" }
        : { createdAt: "desc" };

    const notes = await prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy,
      skip,
      take: parseInt(limit),
    });

    res.json(formatNotes(notes));
  } catch (err) {
    next(err);
  }
}

// GET /api/notes/:id
export async function getNoteById(req, res, next) {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({ where: { id: Number(id) } });

    if (!note) throw httpError("Note not found", 404, "NOT_FOUND");
    res.json(formatNote(note));
  } catch (err) {
    next(err);
  }
}

// POST /api/notes
export async function createNote(req, res, next) {
  try {
    const { title, content, author, isPublic } = req.body;
    const note = await prisma.note.create({
      data: { title, content, author, isPublic },
    });
    res.status(201).json(formatNote(note));
  } catch (err) {
    next(err);
  }
}

// PUT /api/notes/:id
export async function updateNote(req, res, next) {
  try {
    const { id } = req.params;
    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(formatNote(note));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/notes/:id
export async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.note.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    next(err);
  }
}
