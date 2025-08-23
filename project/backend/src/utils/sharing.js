import { prisma } from "./prisma.js";

export async function userCanViewNote(userId, noteId) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) return { ok: false };
  if (note.userId === userId || note.isPublic) return { ok: true, note };
  const share = await prisma.noteShare.findUnique({
    where: { noteId_userId: { noteId, userId } },
  });
  return { ok: !!share, note, share };
}

export async function userCanEditNote(userId, noteId) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) return { ok: false };
  if (note.userId === userId) return { ok: true, note };
  const share = await prisma.noteShare.findUnique({
    where: { noteId_userId: { noteId, userId } },
  });
  return { ok: !!share?.canEdit, note, share };
}
