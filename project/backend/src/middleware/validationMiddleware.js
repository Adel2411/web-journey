// Validate note ID from URL params
const validateNoteId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note ID." });
  }

  req.noteId = id;
  next();
};

// Validate note data for POST, PUT
const validateNoteData = (req, res, next) => {
  const { title, content, authorName, isPublic } = req.body;

  // POST: title and content are required
  if (req.method === "POST") {
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: "Title and content are required." });
    }
  }

  // PUT: at least one field must be present
  if (["PUT"].includes(req.method)) {
    const hasSomeData =
      title !== undefined ||
      content !== undefined ||
      authorName !== undefined ||
      isPublic !== undefined;

    if (!hasSomeData) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided to update." });
    }
  }

  req.validatedNote = {
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(authorName !== undefined && { authorName }),
    ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
  };

  next();
};

export { validateNoteId, validateNoteData };
