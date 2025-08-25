import express from "express";
import { deleteNote, getNotes, updateNote ,addNote ,getNoteById } from "../Controllers/noteController.js";
import { validateNote } from "../Middlewares/Validation.js";
import authorize from "../Middlewares/auth.js";

const router = express.Router();

router.get("/", authorize, getNotes);
router.post("/" , authorize, validateNote ,addNote);
router.get("/:id" , authorize, getNoteById);
router.put("/:id" , authorize, validateNote ,updateNote);
router.delete("/:id" , authorize, deleteNote);

export default router;
