import express from "express"
import { PrismaClient } from '../generated/prisma/index.js';

const router = express.Router();
const prisma = new PrismaClient();

//Get all notes

router.get("/", async (req, res)=> {
    try{
        const {
          page = '1',
          limit = '10',
          search = '',
          sortBy = 'createdAt',
          sortOrder = 'desc',
       } = req.query;

       let where = {};
       if (search) {
           where = {
               OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                ],
           };
        }

        let orderDirection = 'desc'; // default
        if (sortOrder === 'asc') {
           orderDirection = 'asc';
        }


        const notes = await prisma.note.findMany({

            //pagination
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),

            //search
            where,

            //sorting
            orderBy: {
               [sortBy]: orderDirection,
            },
        });

        if(notes.length === 0 ){
            res.status(200).json({message : "No notes found"});

        } else {
            res.status(200).json({
              success: true,
              data: notes
            });
        }
        

    } catch (error) {
        console.error("Error fetching notes :" + error)
        res.status(500).json({error : "Failed to fetch notes"})
    }
})

//Create new note
router.post("/",async(req, res)=>{
    try{
       const {title, content, authorName, isPublic } = req.body 

       if(!title || typeof title !== "string" || title.trim().length < 3 || title.trim().length > 100){
        return res.status(400).json({
            success : false,
            message: "Title must be a non-empty string between 3 and 100 characters"
        })
       }

       if(!content || typeof content !== "string"  || content.trim().length < 5 || content.trim().length > 500){
        return res.status(400).json({
            success: false,
            message : "Content is required and must be between 10 and 1000 characters"
        })
       }

       const newNote = await prisma.note.create({
        data: {
            title,
            content,
            authorName,
            isPublic
        },
        })

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: newNote,
        })

    } catch(error) {
        console.error("Error creting notes :" + error)
        res.status(500).json({error : "Failed to create the note"})
    }
})

//Get specific note by id

router.get("/:id", async(req, res)=> {
    try{
        const id = parseInt(req.params.id)
        const note = await prisma.note.findUnique({
            where : {id}
        })
        
        if(!note){
            return res.status(404).json({
               success: false,
               message: "Note not found",
            });
        }

        res.status(200).json({
           success: true,
           data: note,
        });

    } catch(error){
        console.error("Error fetching note :" + error)
        res.status(500).json({error : "Failed to fetch the note"})
    }
})

//Update note

router.put("/:id", async (req, res)=> {
    try{
        const {title, content, authorName, isPublic} = req.body
        const id = parseInt(req.params.id)
        const note = await prisma.note.findUnique({
            where : {id}
        })


        if(!note){
            return res.status(404).json({
                success: false,
                message : "Note not found"
            })
        }

        if(!title || typeof title !== "string" || title.trim().length < 3 || title.trim().length > 100){
        return res.status(400).json({
            success : false,
            message: "Title must be a non-empty string between 3 and 100 characters"
        })
       }

       if(!content || typeof content !== "string"  || content.trim().length < 5 || content.trim().length > 500){
        return res.status(400).json({
            success: false,
            message : "Content is required and must be between 10 and 1000 characters"
        })
       }

        const updatedNote = await prisma.note.update({
           where: { id }, 
            data: {
                title,
                content ,
                authorName,
                isPublic
            }
        })

        res.status(200).json({
            success : true,
            data : updatedNote
        })

    } catch (error){
        console.error("Error updating note :" + error)
        res.status(500).json({error : "Failed to update the note"})
    }
})

//Delete note

router.delete("/:id", async (req, res) => {
  try {

    const id = parseInt(req.params.id);

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }


    await prisma.note.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete the note" });
  }
});




export default router;
