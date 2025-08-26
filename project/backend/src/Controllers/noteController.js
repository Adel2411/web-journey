import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getNotes = async (req, res) => {
  try {
    const { title, content, skip, take } = req.query;

    const pagination = {};
      if (skip) pagination.skip = +skip;
      if (take) pagination.take = +take;

    const filtering =
      title || content
        ? {
          title: { contains: title || "", mode: "insensitive" },
          content: { contains: content || "", mode: "insensitive" },
          }
          : {};

      const roleCheck =    
        req.user.role=="user" ? {user_id : req.user.id} : {}

      const findnote = await prisma.note.findMany({
        where: {
          ...roleCheck ,
          ...filtering
        },
        ...pagination,
        orderBy: [
          { title: "asc" },
          { createdAt: "asc" },
        ],
        });

        return res.json(findnote);

  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export const addNote = async (req, res) => {
  try {
    const { title, content, isPublic, userId: requestedUserId } = req.body;

    let noteOwnerId = req.user.id; 

    if (req.user.role === "admin" && requestedUserId) {
      noteOwnerId = requestedUserId;
    }

    const owner = await prisma.user.findUnique({ where: { id: noteOwnerId } });
    if (!owner) return res.status(404).send("User not found");

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        isPublic,
        user_id: noteOwnerId,
      },
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error });
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

    if((getnote.user_id!==req.user.id)&&(req.user.role!=="admin")){
      return res.status(404).send("you don t have access to this note")
    }

    res.send(getnote);

  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve note", error });
  }
};

export const updateNote = async(req,res) =>{
  const goodId = parseInt(req.params.id);
  const { title, content, authorName, isPublic } = req.body;
  try {
     const getnote = await prisma.note.findUnique({
    where: { id: goodId }
    });

    if (!getnote) return res.status(404).send("note not found");
    
    if((getnote.user_id!==req.user.id)&&(req.user.role!=="admin")){
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

    res.json(updateNote);

  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error });
  }
};

export const deleteNote = async(req,res) =>{
  const goodId = parseInt(req.params.id);
  try {

  const getnote = await prisma.note.findUnique({
    where: { id: goodId }
  });

  if (!getnote) return res.status(404).send("note not found");

  if((getnote.user_id!==req.user.id)&&(req.user.role!=="admin")){
    return res.status(401).send("you don t have access to delete this note")
  }

   await prisma.note.delete({
    where: { id: goodId }
  });

  res.send("note deleted");
} catch (error) {
  res.status(500).json({ message: "Failed to delete note", error });
}
};