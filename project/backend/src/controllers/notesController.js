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

    const notes = await prisma.note.findMany({
      take: limit,
      skip,
      orderBy,
      where: {
        userId: req.user.id, // only this user's notes
      },
    });

    const total = await prisma.note.count({
      where: { userId: req.user.id },
    })



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
  const { title, content, isPublic = true } = req.body;

  try {
    const created = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isPublic,
        user: {
          connect: { id: req.user.id } 
        }
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
    if(note.userId !== req.user.id) return next(httpError("You are not authorized to access this note", 404, "NOT_FOUND"))

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
    if( existing.userId !== req.user.id) return next(httpError("You are not authorized to update this note", 404, "NOT_FOUND"));

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
    if(existing.userId !== req.user.id) return next(httpError("You are not authorized to delete this note", 404, "FORBIDDEN"));
    await prisma.note.delete({ where: { id: noteId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
