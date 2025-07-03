import express from 'express';
import { PrismaClient } from '@prisma/client';
import noteValidator from '../middlewares/validations.js';


const router = express.Router();
const prisma = new PrismaClient();

//marche
router.get("/", async(req, res)=>{
    try{
        // celle si est la pagination 
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;

        //ici si en veut rechercher qlq chose dans les notes
        const search = req.query.search || "";

        // ici le tri des notes 
        let orderBy = { createdAt: "desc" }; 
        
        switch (req.query.sort) {
            case "oldest":
                orderBy = { createdAt: "asc" };
                break;
            case "title_asc":
                orderBy = { title: "asc" };
                break;
            case "title_desc":
                orderBy = { title: "desc" };
                break;
        }

        let whereClause = {};

        if (search) {
            whereClause = {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            };
        }


        const totalNotes = await prisma.note.count({where: whereClause});

        const notes = await prisma.note.findMany({
            where: whereClause,
            orderBy,
            skip,
            take: limit,
        });
        
        res.json({
            page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes,
            notes,
        });
    }catch(error){
        console.error("Error fetching notes:", error);
        res.status(500).json({error:"Internal error!!!"});
    }
});

//marcheeee 
router.post("/", noteValidator, async(req, res)=>{
    try{
        const {title, content, authorName, isPublic} = req.body;

        const newNote = await prisma.note.create({
            data: {
                title,
                content,
                authorName,
                isPublic
            },
        });

        res.status(201).json(newNote);
    }catch(error){
        console.error("Error creatin note:", error);
        res.status(500).json({error:"Internal server error!!"});
    }
});

//tester
router.get("/:id", async(req, res)=>{
    const {id} = req.params;
    try{
        const note = await prisma.note.findUnique({
            where:{
                id: parseInt(id),
            }
        })
        if (!note){
            res.status(404).json({error: "Note not found!!"});
        }
        res.json(note);
    }catch(erro){
        console.error("Error getting note:", error);
        res.status(500).json({error:"Note not found !"});
    }
})

//tester
router.put("/:id", noteValidator, async(req, res)=>{
    
    try{

        const {id} = req.params;
        const {title , content, authorName, isPublic} = req.body;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ error: "Invalid note ID." });
        }

        const existingNote = await prisma.note.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingNote) {
          return res.status(404).json({ error: "Note not found." });
        }

        const updatedNote = await prisma.note.update({
            where:{
                id: parseInt(id),
            },
            data:{
            title,
            content,
            authorName,
            isPublic,
            updatedAt: new Date()
        }
        })
        
        res.json(updatedNote);
    }catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Failed to update note." });
    } 
});

//testerrr 
router.delete("/:id", async(req, res)=>{
    const {id} = req.params;
    try{
        if(isNaN(parseInt(id))){
            return res.status(400).json({error:"Invalid ID !!"});
        }
        const existingNote = await prisma.note.findUnique({
            where:{id : parseInt(id)},
        })
        if(!existingNote){
            return res.status(404).json({error:"Note not found!!"});
        }
        await prisma.note.delete({
            where:{
                id: parseInt(id),
            }
        })
        res.json({message:"Note deleted with success!!"});
    }catch(error){
        console.error("error deleting note:", error);
        res.status(500).json({error:"Failed to delete note!"});
    }
})

export default router;