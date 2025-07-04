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
