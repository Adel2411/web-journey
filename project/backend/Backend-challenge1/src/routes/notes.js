import express from "express";
import { deleteNote, getNotes, updateNote ,addNote ,getNoteById } from "../Controllers/Controller.js";
import { validateNote } from "../Middlewares/Middleware.js";

const router = express.Router();

router.get("/",getNotes);
router.post("/" ,validateNote ,addNote);
router.get("/:id" ,getNoteById);
router.put("/:id" ,validateNote ,updateNote);
router.delete("/:id" ,deleteNote);

export default router;
