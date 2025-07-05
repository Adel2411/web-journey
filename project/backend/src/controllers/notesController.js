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
};

// GET note by id
export const getNoteById = async (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format"});
    }
    try {
       const note = await prisma.note.findUnique({where: {id}}) ;
       if(!note) return res.status(404).json( { error: "Note not found"});
       res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch the note"}); 
    }
};