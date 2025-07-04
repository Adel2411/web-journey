import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});


// Get a specific note
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
});


// Create a new note
router.post("/", async (req, res) => {
  const { title, content, authorName, isPublic = true } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const note = await prisma.note.create({
    data: { title, content, authorName, isPublic },
  });

  res.status(201).json(note);
});



// Update a note
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, authorName, isPublic } = req.body;

  try {
    const updated = await prisma.note.update({
      where: { id },
      data: { title, content, authorName, isPublic },
    });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Note not found" });
  }
});

