import express from "express";
import { prisma } from "../prismaClient.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";
import { successResponse, errorResponse, notFoundResponse } from "../utils/responseFormatter.js";

export const notesRouter = express.Router();

export const getAllNotes = async (req, res, next) => {
    const { authorName } = req.query;
    try {
        if(authorName) {
            const notes = await prisma.note.findMany({
            where: { 
                authorName: {
                    contains: authorName,
                    mode: "insensitive"
                } 
            },
            orderBy: { id: 'asc' },
        });

        if (notes.length === 0) {
            return notFoundResponse(res, "No notes found for the specified author");
        }

        return res.json(notes);
        }

        const notes = await prisma.note.findMany({
            orderBy: { id: 'asc' },
        });

        if (notes.length === 0) {
            return notFoundResponse(res, "No notes found");
        }

        return res.json(notes);
    } catch (error) {
        console.error("Error fetching note:", error);
        return errorResponse(res, 500, "Failed to fetch notes");
    }
}

export const createNote = async (req, res, next) => {
    const { title, content, authorName, isPublic } = req.body;

    if (!title || !content || !authorName) {
        return errorResponse(res, 400, "Title, content, and author name are required");
    }

    try {
        const newNote = await prisma.note.create({
            data: {
                title,
                content,
                authorName,
                isPublic: isPublic ?? true,
            },
        });
        return createdResponse(res, newNote, "Note created successfully");
    } catch (error) {
        console.error("Error creating note:", error);
        return errorResponse(res, 500, "Failed to create note");
    }
}

export const updateNote = async (req, res, next) => {
    const { id } = req.params;
    const { title, content, authorName, isPublic } = req.body;

    if (Object.keys(req.body).length === 0) {
        return errorResponse(res, 422, "At least one field must be provided to update the note");
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
                authorName,
                isPublic,
            },
        });
        return successResponse(res, updatedNote, "Note updated successfully");
    } catch (error) {
        return handlePrismaError(error, res, "Failed to update note");
    }
}

export const deleteNote = async (req, res, next) => {
    const { id } = req.params;

    try {
        await prisma.note.delete({
            where: { id: parseInt(id) },
        });
        return successResponse(res, null, "Note deleted successfully");
    } catch (error) {
        handlePrismaError(error, res, "Failed to delete note");
    }
}

export const getNoteById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) },
        });

        if (!note) {
            return notFoundResponse(res, "note not found");
        }

        res.json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        return errorResponse(res, 500, "Failed to fetch note");
    }
}