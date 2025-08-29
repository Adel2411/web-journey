import { prisma } from "../utils/prisma.js";
import { formatNote, formatNotes } from "../utils/noteFormatter.js";
import { httpError } from "../utils/errorHandler.js";
import { userCanViewNote, userCanEditNote } from "../utils/sharing.js";
import { ok, created, noContentOk, fail } from "../utils/response.js";

// GET /api/notes  ── list notes with search, sorting, and pagination
export const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 3, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const where = {
      OR: [
        { userId },
        {
          shares: {
            some: { userId },
          },
        },
      ],
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
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
    const [notes, total] = await prisma.$transaction([
      prisma.note.findMany({ where, orderBy, skip, take: limit }),
      prisma.note.count({ where }),
    ]);
    const formatted = formatNotes(notes);
    return ok(res, {
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
  const { title, content, isPublic = true, authorName } = req.body;
  try {
    const newNote = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isPublic,
        // Only set authorName if provided; otherwise Prisma default remains
        ...(authorName !== undefined
          ? { authorName: String(authorName).trim() }
          : {}),
        userId: req.user.userId,
      },
    });
    return created(res, formatNote(newNote));
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const noteId = Number(req.params.id);
    const perm = await userCanViewNote(req.user.userId, noteId);
    if (!perm.ok) return next(httpError("Note not found", 404, "NOT_FOUND"));
    return ok(res, formatNote(perm.note));
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const { title, content, isPublic, authorName } = req.body;
  const data = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (isPublic !== undefined) data.isPublic = isPublic;
  if (authorName !== undefined) data.authorName = String(authorName).trim();
  try {
    const perm = await userCanEditNote(req.user.userId, noteId);
    if (!perm.ok) return next(httpError("Note not found", 404, "NOT_FOUND"));
    const updated = await prisma.note.update({ where: { id: noteId }, data });
    return ok(res, formatNote(updated));
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  try {
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing || existing.userId !== req.user.userId) {
      return next(httpError("Note not found", 404, "NOT_FOUND"));
    }
    await prisma.note.delete({ where: { id: noteId } });
    return noContentOk(res, "Note deleted.");
  } catch (err) {
    next(err);
  }
};

// POST /api/notes/:id/share  body: { userId, canEdit }
export const shareNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const { userId, canEdit = false } = req.body || {};
  try {
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing || existing.userId !== req.user.userId) {
      return next(httpError("Note not found", 404, "NOT_FOUND"));
    }
    if (userId === req.user.userId) {
      return fail(
        res,
        "Cannot share a note with yourself.",
        400,
        "BAD_REQUEST"
      );
    }
    const share = await prisma.noteShare.upsert({
      where: { noteId_userId: { noteId, userId } },
      update: { canEdit },
      create: { noteId, userId, canEdit },
    });
    return ok(res, { id: share.id, noteId, userId, canEdit: share.canEdit });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notes/:id/share/:userId
export const unshareNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const targetUserId = Number(req.params.userId);
  try {
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing || existing.userId !== req.user.userId) {
      return next(httpError("Note not found", 404, "NOT_FOUND"));
    }
    await prisma.noteShare.delete({
      where: { noteId_userId: { noteId, userId: targetUserId } },
    });
    return noContentOk(res, "Share removed.");
  } catch (err) {
    // if not found, still respond 204 (idempotent)
    if (err?.code === "P2025") return noContentOk(res, "Share removed.");
    next(err);
  }
};
