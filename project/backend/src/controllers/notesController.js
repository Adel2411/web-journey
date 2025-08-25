import { prisma } from "../utils/prisma.js";
import { formatNote, formatNotes } from "../utils/noteFormatter.js";
import { httpError } from "../utils/errorHandler.js";

// GET /api/notes  ── list notes with search, sorting, and pagination
export const getNotes = async (req, res, next) => {
  try {
    /* ---------- pagination ---------- */
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 3, 1);
    const skip = (page - 1) * limit;

    /* ---------- search filter ---------- */
    const search = req.query.search || "";
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

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

    /* ---------- respond ---------- */
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

export const createNote = async (req, res, next) => {
  const { title, content, authorName = "Unknown", isPublic = true } = req.body;
  try {
    const created = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorName,
        isPublic,
      },
    });
    res.status(201).json(formatNote(created));
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!note) return next(httpError("Note not found", 404, "NOT_FOUND"));
    res.status(200).json(formatNote(note));
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const { title, content, authorName, isPublic } = req.body;

  const data = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (authorName !== undefined) data.authorName = authorName;
  if (isPublic !== undefined) data.isPublic = isPublic;

  try {
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing) return next(httpError("Note not found", 404, "NOT_FOUND"));

    const updated = await prisma.note.update({ where: { id: noteId }, data });
    res.status(200).json(formatNote(updated));
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  try {
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing) return next(httpError("Note not found", 404, "NOT_FOUND"));
    await prisma.note.delete({ where: { id: noteId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
