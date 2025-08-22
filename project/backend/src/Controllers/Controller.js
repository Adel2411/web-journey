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
        title: { contains: title || "", mode: "insensitive" },
        content: { contains: content || "", mode: "insensitive" },
      },
      ...pagination,
    });
    return res.json(findnote);
  } else {
    const notes = await prisma.note.findMany({
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
    const { title, content, authorName, isPublic } = req.body;
    const newNote = {
      "title": title,
      "content": content,
      "authorName": authorName,
      "isPublic": isPublic
    };
    const creatnewNote = await prisma.note.create({ data: newNote });
    res.status(200).send(creatnewNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).send("Failed to create note");
  }
};

export const getNoteById = async(req,res) =>{
  const goodId = parseInt(req.params.id);
  const getnote = await prisma.note.findUnique({
       where : { id : goodId}
  });
  if(!getnote) return res.status(404).send("note not found");
  res.send(getnote);
};

export const updateNote = async(req,res) =>{
  const goodId = parseInt(req.params.id);
  const { title, content, authorName, isPublic } = req.body;
  try {
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
  const deletenote = await prisma.note.delete({
    where: { id: goodId }
  });
  res.send("note deleted");
} catch (error) {
  console.error("Error deleting note:", error);
  res.status(500).send("Failed to delete note");
}
};