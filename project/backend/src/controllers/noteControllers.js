import prisma from "../prisma-client.js";

const getAllNotes = async (req, res, next) => {
  const { title, content } = req.query;

  try {
    // Title and content params
    const filters = {};
    if (title) {
      filters.title = {
        contains: title,
        mode: "insensitive",
      };
    }
    if (content) {
      filters.content = {
        contains: content,
        mode: "insensitive",
      };
    }

    const notes = await prisma.note.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    if (notes.length === 0) {
      return res
        .status(200)
        .json({ err: false, msg: "No blogs at the moment" });
    }

    return res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
};

const getNote = async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });

    if (!note) {
      return res.status(404).json({ err: true, msg: "Note not found" });
    }

    return res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

const createNote = async (req, res, next) => {
  const { title, content, authorName, isPublic } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ err: true, msg: "You have to enter a title and content" });
  }
  if (
    title.trim().length > 15 ||
    title.trim().length < 3 ||
    content.trim().length > 100 ||
    content.trim().length < 8
  ) {
    return res.status(400).json({
      err: true,
      msg: "You have to enter a title with the length between 2 and 15 characters. And a content with the length between 8 and 100 characters",
    });
  }

  try {
    const createdNote = await prisma.note.create({
      data: { title, content, authorName, isPublic },
    });

    return res.status(201).json(createdNote);
  } catch (err) {
    next(err);
  }
};

const editNote = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, authorName, isPublic } = req.body;

  const isTitleValid =
    typeof title === "string" &&
    title.trim().length < 15 &&
    title.trim().length > 2;
  const isContentValid =
    typeof content === "string" &&
    content.trim().length < 100 &&
    content.trim().length > 8;
  const isAuthorNameValid =
    authorName !== undefined &&
    typeof authorName === "string" &&
    authorName.trim().length > 0;
  const isPublicValid = isPublic !== undefined && typeof isPublic === "boolean";

  const updatedFields = {};
  isTitleValid ? (updatedFields.title = title) : "";
  isContentValid ? (updatedFields.content = content) : "";
  isAuthorNameValid ? (updatedFields.authorName = authorName) : "";
  isPublicValid ? (updatedFields.isPublic = isPublic) : "";

  // Title and content validation
  if (!isTitleValid || !isContentValid) {
    return res.status(400).json({
      error: true,
      msg: "Both title and content are required. Title must be 3-15 characters. Content must be 8-100 characters.",
    });
  }

  // Author and isPublic validation
  if (
    (isPublic !== undefined && !isPublicValid) ||
    (!isAuthorNameValid && authorName !== undefined)
  ) {
    return res.status(400).json({
      error: true,
      msg: "Invalid 'authorName' or 'isPublic' provided. Author name must be a non-empty string. isPublic must be a boolean.",
    });
  }

  try {
    const note = await prisma.note.update({
      where: { id: parseInt(id) },
      data: updatedFields,
    });

    if (!note) {
      return res.status(404).json("Note not found");
    }

    return res.status(200).json({ msg: "Note updated successfully", note });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedNote = await prisma.note.delete({
      where: { id: parseInt(id) },
    });

    if (!deletedNote) {
      return res.status(404).json("Note not found");
    }

    return res.status(200).json({ msg: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export default { getAllNotes, createNote, getNote, editNote, deleteNote };
