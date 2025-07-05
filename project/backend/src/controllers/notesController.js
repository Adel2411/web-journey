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

// PUT to update note by id
export const updateNote = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content, authorName, isPublic } = req.body;
        const existe = await prisma.note.findUnique({ where: { id }});
        if (!existe) {
            return res.status(404).json({ error: "Note not found"});
        }
        const updatedNote = await prisma.note.update(
            { where: { id }, data: { title, content, authorName, isPublic, updatedAt: new Date(),}}
        );
        res.json(updatedNote);
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: "Something went wrong!"});
    }
};

// POST to create a note
export const createNote = async (req, res) => {
    try {
        const { title, content, authorName, isPublic } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required"});
        }
        const newNote = await prisma.note.create(
            { data: { title, content, authorName: authorName || null, isPublic: isPublic !== undefined ? isPublic : true, createdAt: new Date(), updatedAt: new Date() }}
        );
        res.status(201).json(newNote);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong!"});
    }
};

// DELETE note by id
export const deleteNote = async (req, res) => {
   try {
        const { id } = req.params;
        const existing = await prisma.note.findUnique({ where: { id: parseInt(id) }});
        if (!existing) {
            return res.status(404).json({ error: "Note not found"});
        }
        await prisma.note.delete({ where: { id: parseInt(id) }});
        res.json({ message: `Note ${id} deleted successfully` });
   } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong!" });
    }
};