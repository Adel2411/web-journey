import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient();

export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.notes.findMany();
    res.status(200).json({
      success: true,
      count: notes.length,
      data:notes
    });
  } catch (error) {
    res.status(500).json({
       error: "Failed to fetch notes" 
      });
  }
};

export const postNotes = async(req,res)=>{

try {
  const note = await prisma.notes.create({
    data : {
    title : req.body.title,
    content : req.body.content,
    authorName:req.body.authorName,
    isPublic:req.body.isPublic
 

  },
 });
  
  res.status(200).json(note);

} catch (error) {
  res.status(500).json({error:"Failed to create a new note"});
}

}