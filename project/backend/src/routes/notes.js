import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Validation constants
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;
const MIN_CONTENT_LENGTH = 5;
const MAX_CONTENT_LENGTH = 1000;

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });

    const filteredNotes = notes.filter(
      (note) =>
        note.title &&
        note.content &&
        note.title.length >= MIN_TITLE_LENGTH &&
        note.content.length >= MIN_CONTENT_LENGTH
    );

    res.json(filteredNotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Get specific note by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  try {
    const note = await prisma.note.findUnique({ where: { id: parsedId } });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// Create new note
router.post("/", async (req, res) => {
  const {
    title,
    content,
    authorName = "Anonymous",
    isPublic = true,
  } = req.body;

  if (
    !title?.trim() ||
    !content?.trim() ||
    title.length < MIN_TITLE_LENGTH ||
    title.length > MAX_TITLE_LENGTH ||
    content.length < MIN_CONTENT_LENGTH ||
    content.length > MAX_CONTENT_LENGTH
  ) {
    return res.status(400).json({
      error: `Title must be ${MIN_TITLE_LENGTH}-${MAX_TITLE_LENGTH} chars. Content must be ${MIN_CONTENT_LENGTH}-${MAX_CONTENT_LENGTH} chars.`,
    });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        authorName,
        isPublic,
      },
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update note
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, authorName, isPublic } = req.body;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  if (
    !title?.trim() ||
    !content?.trim() ||
    title.length < MIN_TITLE_LENGTH ||
    title.length > MAX_TITLE_LENGTH ||
    content.length < MIN_CONTENT_LENGTH ||
    content.length > MAX_CONTENT_LENGTH
  ) {
    return res.status(400).json({
      error: `Title must be ${MIN_TITLE_LENGTH}-${MAX_TITLE_LENGTH} chars. Content must be ${MIN_CONTENT_LENGTH}-${MAX_CONTENT_LENGTH} chars.`,
    });
  }

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: parsedId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const updatedNote = await prisma.note.update({
      where: { id: parsedId },
      data: {
        title,
        content,
        authorName,
        isPublic,
        updatedAt: new Date(),
      },
    });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: parsedId },
    });
    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.note.delete({ where: { id: parsedId } });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
 

