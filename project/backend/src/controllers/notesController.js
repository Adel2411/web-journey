import { prisma } from "../utils/prisma.js";
import { formatNote, formatNotes } from "../utils/noteFormatter.js";
import { httpError } from "../utils/errorHandler.js";

// GET /api/notes with search, sort, pagination
export async function getNotes(req, res, next) {
  try {
    const { search = "", sort = "newest", page = 1, limit = 1000 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "title_asc"
        ? { title: "asc" }
        : sort === "title_desc"
        ? { title: "desc" }
        : { createdAt: "desc" };

    //   Filter notes by the logged-in user
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.id, // only notes owned by this user
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy,
      skip,
      take: parseInt(limit),
      include: { user: { select: { id: true, name: true } } },
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
    const note = await prisma.note.findUnique({ where: { id: Number(id) }, include: { user: { select: { id: true, name: true } } } });

    if (!note) throw httpError("Note not found", 404, "NOT_FOUND");

    //   Ownership check
    if (note.userId !== req.user.id) {
      throw httpError("Not authorized", 403, "FORBIDDEN");
    }

    res.json(formatNote(note));
  } catch (err) {
    next(err);
  }
}

// POST /api/notes
export async function createNote(req, res, next) {
  try {
    const { title, content, isPublic } = req.body;

    //   Remove "author" field, link note to authenticated user
    const note = await prisma.note.create({
      data: {
        title,
        content,
        isPublic,
        userId: req.user.id,
      },
      include: { user: { select: { id: true, name: true } } },
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

    const existingNote = await prisma.note.findUnique({ where: { id: Number(id) } });
    if (!existingNote) throw httpError("Note not found", 404, "NOT_FOUND");

    //   Ownership check
    if (existingNote.userId !== req.user.id) {
        throw httpError("Note not found", 404, "NOT_FOUND"); 
    }

    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: req.body,
      include: { user: { select: { id: true, name: true } } },
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

    const existingNote = await prisma.note.findUnique({ where: { id: Number(id) } });
    if (!existingNote) throw httpError("Note not found", 404, "NOT_FOUND");

    //   Ownership check
    if (existingNote.userId !== req.user.id) {
throw httpError("Note not found", 404, "NOT_FOUND"); 
    }

    await prisma.note.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    next(err);
  }
}
