import express, { json } from "express";
import { PrismaClient } from "@prisma/client";
import {body, validationResult} from 'express-validator'

const router = express.Router();
const prisma = new PrismaClient();

//Enhanced Validation
const validateNote=[
    body('title')
    .trim()
    .notEmpty().withMessage('Title must not be empty or withespace!')
    .isLength({min:6}).withMessage('Title must be at least 6 characters long ')
    .isLength({max:100}).withMessage('Title must not exceed 100 characters.'),

    body('content')
    .trim()
    .notEmpty().withMessage('Content must not be empty or withespace!')
    .isLength({min:10}).withMessage('Content must be at least 10 characters long ')
    .isLength({max:1000}).withMessage('Content must not exceed 1000 characters.'),

    //middleware -handle validation error 

]


router.get('/', async(req, res, next) => {
    try {
        const notes= await prisma.note.findMany({
            orderBy: {createdAt: "desc"}
        });
            const total = await prisma.note.count();

        if (notes.length==0) {
              return res.status(200).json({ message: "No notes found",total, data: [] });

        }
        return res.status(200).json({total, data: notes});
    }catch (error){
        /*console.error(error);
        return res.status(500).json({ error: "Server error while fetching notes" });
   */
        next(err);
    }
});

router.get('/:id',  async (req, res,next) => {
    const noteId= parseInt(req.params.id);

    try{

    const note= await prisma.note.findUnique({
        where :{id: noteId}
    });
    if (!note) {
        return res.status(404).json({message: "Note not found!"});
    }
    return res.status(200).json({note})
    }
    catch(error){
        /*console.error(error);
        return res.status(500).json({ error: "Server error while fetching notes" });
   */
        next(err);
    }
})

router.post('/',validateNote, async(req,res,next)=>{
    const { title , content , authorName, isPublic}=req.body;
    //minimum length requirements for title and content
    if (!title || title.length < 6) {
                return res.status(400).json({message: 'Title must be at least 6 characters'});
    }
    if (!content || content.length < 10) {
                return res.status(400).json({message: 'content must be at least 10 characters'});
    } 
    
    try {
        
        const newNote= await prisma.note.create({
            data:{
                title ,
                content,
                authorName: authorName?? "Anonymous",
                isPublic: isPublic?? true,
            },
        });
        return res.status(201).json(newNote);
    }catch (err){
        /*console.error("! POST /api/notes error ", err);
        return res.status(500).json({error: "could not create not , please try again "});*/
        next(err);
    }
})

router.put('/:id', async(req,res,next)=>{
    const noteId= parseInt(req.params.id)
    const { title , content , authorName, isPublic}=req.body;

    try{
        const noteUpdated= await prisma.note.update({// prisma.note.findUnique
        where :{id: noteId},
        data: {
            title,content,authorName,isPublic,
        },
    });
    return res.status(200).json(noteUpdated)
    }
    catch (err) {
        /* if (err.code === 'P2025') {  // Prisma: record not found
      return res.status(404).json({ error: "Note not found" });
    }
    return res.status(500).json({ error: "Server error", detail: err.message });
  */
 next(err);
    }
})

router.delete('/:id', async(req,res, next)=>{
    const noteId= parseInt(req.params.id)
    
    try{
        await prisma.note.delete({where: {id: noteId}});
        return res.status(200).json({message: "Note deleted successfully !"});
    }catch (err){
        next(err);
        /*
        
    if (err.code === 'P2025'){
      return res.status(404).json({ error: "Note not found" });
    }
    return res.status(500).json({ error: "Server error", detail: err.message });
         */
  }

})



export default router;