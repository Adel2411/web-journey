import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST create new note
router.post("/", async (req, res) => {
  try {
    const { title, content, authorName, isPublic } = req.body;

    // Validate required fields (title and content)
    if (!title || !content) {
      return res.status(400).json({ 
        error: "Title and content are required" 
      });
    }

    // Validate title
    if (title.trim().length === 0) {
      return res.status(400).json({ 
        error: "Title cannot be empty" 
      });
    }

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorName: authorName?.trim() || null,
        isPublic: isPublic ?? true,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// GET get specific note by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// PUT update a note
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, authorName, isPublic } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    // Validate required fields (title and content)
    if (!title || !content) {
      return res.status(400).json({ 
        error: "Title and content are required" 
      });
    }

    // Validate title
    if (title.trim().length === 0) {
      return res.status(400).json({ 
        error: "Title cannot be empty" 
      });
    }

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        authorName: authorName?.trim() || null,
        isPublic: isPublic ?? note.isPublic,
      },
    });

    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// DELETE delete note
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.note.delete({
      where: { id },
    });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;