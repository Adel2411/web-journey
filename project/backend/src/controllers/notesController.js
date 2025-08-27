import { prisma } from "../utils/prisma.js";
import { formatNote, formatNotes } from "../utils/noteFormatter.js";
import { httpError } from "../utils/errorHandler.js";

// GET /api/notes ── list ONLY the current user's notes with search, sorting, and pagination
export const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id; // ✅ only fetch current user's notes

    /* ---------- pagination ---------- */
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 3, 1);
    const skip = (page - 1) * limit;

    /* ---------- search filter ---------- */
    const search = req.query.search || "";
    const where = {
      userId,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    /* ---------- sorting ---------- */
    let orderBy;
    switch (req.query.sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "title_asc":
        orderBy = { title: "asc" };
        break;
      case "title_desc":
        orderBy = { title: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    /* ---------- fetch paginated results + total count ---------- */
    const [notes, total] = await prisma.$transaction([
      prisma.note.findMany({ where, orderBy, skip, take: limit }),
      prisma.note.count({ where }),
    ]);

    const formatted = formatNotes(notes);

    res.status(200).json({
      notes: formatted,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/notes ── create note for current user
export const createNote = async (req, res, next) => {
  try {
    const { title, content, isPublic = true } = req.body;

    if (!title || !content) {
      return next(httpError("Title and content are required", 400));
    }

    const created = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isPublic,
        userId: req.user.id, 
      },
    });

    res.status(201).json(formatNote(created));
  } catch (err) {
    next(err);
  }
};


// GET /api/notes/:id ── only if it belongs to current user
export const getNoteById = async (req, res, next) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: Number(req.params.id), userId: req.user.id },
    });

    if (!note) return next(httpError("Note not found", 404, "NOT_FOUND"));
    res.status(200).json(formatNote(note));
  } catch (err) {
    next(err);
  }
};

// PUT /api/notes/:id ── update only if owned by current user
export const updateNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const { title, content, isPublic } = req.body;

  const data = {};
  if (title !== undefined) data.title = title.trim();
  if (content !== undefined) data.content = content.trim();
  if (isPublic !== undefined) data.isPublic = isPublic;

  try {
    const existing = await prisma.note.findFirst({
      where: { id: noteId, userId: req.user.id },
    });
    if (!existing) return next(httpError("Note not found", 404, "NOT_FOUND"));

    const updated = await prisma.note.update({
      where: { id: noteId },
      data,
    });

    res.status(200).json(formatNote(updated));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notes/:id ── delete only if owned by current user
export const deleteNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  try {
    const existing = await prisma.note.findFirst({
      where: { id: noteId, userId: req.user.id },
    });
    if (!existing) return next(httpError("Note not found", 404, "NOT_FOUND"));

    await prisma.note.delete({ where: { id: noteId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
