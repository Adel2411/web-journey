import express from "express";
import { getAllNotes } from "../controllers/notesController.js";

const router = express.Router();

//GET /api/notes 
router.get("/", getAllNotes);

export default router;