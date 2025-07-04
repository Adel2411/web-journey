import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});
