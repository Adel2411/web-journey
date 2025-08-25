import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getNotes = async (req, res) => {
  const { title, content, skip, take } = req.query;

  const pagination = {};
  if (skip) pagination.skip = +skip;
  if (take) pagination.take = +take;

  if (title || content) {
    const findnote = await prisma.note.findMany({
      where: {
        user_id: req.user.id,
        title: { contains: title || "", mode: "insensitive" },
        content: { contains: content || "", mode: "insensitive" },
      },
      ...pagination,
    });

    return res.json(findnote);

  } else {
    const notes = await prisma.note.findMany({
      where: {
        user_id: req.user.id
      } ,
      ...pagination,
      orderBy: [
        { title: "asc" },
        { createdAt: "asc" },
      ],
    });

    return res.json(notes);
  }
};

export const addNote = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const userId = req.user.id;
    const finduser = await prisma.user.findUnique({ where: { id: userId } });
    const newNote = {
      "title": title,
      "content": content,
      "authorName":finduser.name,
      "isPublic": isPublic,
      "user_id": userId
    };

    const creatnewNote = await prisma.note.create({ data: newNote });
    res.status(201).send(creatnewNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).send("Failed to create note");
  }
};

export const getNoteById = async(req,res) =>{
  try {
    const goodId = parseInt(req.params.id);
    const getnote = await prisma.note.findUnique({
        where : 
        { id : goodId}
    });

    if(!getnote) return res.status(404).send("note not found");

    if(getnote.user_id!==req.user.id){
      return res.status(401).send("you don t have access to this note")
    }

    res.send(getnote);

  } catch (error) {
    console.error("Error finding note:", error);
    console.error("Error finding note:", error);  }
};

export const updateNote = async(req,res) =>{
  const goodId = parseInt(req.params.id);
  const { title, content, authorName, isPublic } = req.body;
  try {
     const getnote = await prisma.note.findUnique({
    where: { id: goodId }
    });

    if (!getnote) return res.status(404).send("note not found");
    
    if(req.user.id!==getnote.user_id){
    return res.status(401).send("you don t have access to update this note")
    }

    const updateNote = await prisma.note.update({
      where : {id : goodId},
      data : {
        "title": title,
        "content": content,
        "authorName": authorName,
        "isPublic": isPublic
      }
    })

    res.status(200).json(updateNote);

  } catch (error) {
    console.error("Error updating note:", error);
    res.status(404).send("note not found");
  }
};

export const deleteNote = async(req,res) =>{
  const goodId = parseInt(req.params.id);
  try {

  const getnote = await prisma.note.findUnique({
    where: { id: goodId }
  });

  if (!getnote) return res.status(404).send("note not found");

  if(req.user.id!==getnote.user_id){
    return res.status(401).send("you don t have access to delete this note")
  }

   await prisma.note.delete({
    where: { id: goodId }
  });

  res.send("note deleted");
} catch (error) {
  console.error("Error deleting note:", error);
  res.status(500).send("Failed to delete note");
}
};