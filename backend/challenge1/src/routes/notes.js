const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

router.get('/api/notes', async (req, res) => {
    try {
        const notes = await prisma.note.findMany();

        if (!notes || notes.length === 0) {
            return res.status(404).json({ message: 'No notes found' ,
                notes: [] });
        }

        const fomatedNotes = notes.map(note => ({
            id: note.id,
            title: note.title,
            content: note.content,
            authorName: note.authorName,
            isPublic: note.isPublic,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        }));

        return res.status(200).json({ message: 'Notes retrieved successfully', fomatedNotes });

    }

    catch (err){
        console.error('Error retrieving notes:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/api/notes', async (req, res) => {
    const { title, content, authorName, isPublic } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    try {
        const newNote = await prisma.note.create({
            data: {
                title,
                content,
                authorName: authorName || null,
                isPublic: isPublic !== undefined ? isPublic : true,
            },
        });
        return res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (err) {
        console.error('Error creating note:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) },
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        return res.status(200).json({ message: 'Note retrieved successfully', note });
    } catch (err) {
        console.error('Error retrieving note:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, authorName, isPublic } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const existingNote = await prisma.note.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const updatedNote = await prisma.note.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
                authorName: authorName || null,
                isPublic: isPublic !== undefined ? isPublic : existingNote.isPublic,
            },
        });

        return res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    } catch (err) {
        console.error('Error updating note:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingNote = await prisma.note.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await prisma.note.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Error deleting note:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;