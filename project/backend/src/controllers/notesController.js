import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/notes
export const getAllNotes = async (req, res) => {
    try{
        const notes = await prisma.note.findMany();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
}