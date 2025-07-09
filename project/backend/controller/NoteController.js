import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient();

export const getNotes = async (req, res,next) => {

  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Search
    const search = req.query.search || '';

    // Sorting
    const sort = req.query.sort === 'asc' ? 'asc' : 'desc';

    // Prisma filter
    const where = {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    };

    // Get data + total count
    const [notes, totalNotes] = await Promise.all([
      prisma.notes.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sort } 
      }),
      prisma.notes.count({ where })
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit),
      data: notes
    });

  } catch (err) {
    next(err)
  }
}

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

export const getNoteById = async(req,res)=>{

  try {
    const note = await prisma.notes.findUnique({
      where:{
      id: Number(req.params.id),
      }
    });
    if(!note)
    {
         return res.status(404).json({ error: "Note not found" });
     
    }
     res.status(200).json({
        success:true,
        data:note
      })

  } catch (error) {
    res.status(500).json({error:"can't find a specific note"})
  }
}
export const editNote = async (req, res) => {
  try {
    const note = await prisma.notes.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: req.body.title,
        content: req.body.content,
        authorName: req.body.authorName,
        isPublic: req.body.isPublic
       
      },
    });
    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    if (error.code === 'P2025') { // Prisma not found error
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await prisma.notes.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: note,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(500).json({ error: "Failed to delete note" });
  }
};



