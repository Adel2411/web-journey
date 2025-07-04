const validateNoteId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid note ID." });
  }

  req.noteId = id;
  next();
};

const validateNoteData = (req, res, next) => {
  const { title, content, authorName, isPublic } = req.body;

  const MIN_TITLE_LENGTH = 3;
  const MAX_TITLE_LENGTH = 100;
  const MIN_CONTENT_LENGTH = 10;
  const MAX_CONTENT_LENGTH = 5000;

  // POST: title and content are required
  if (req.method === "POST") {
    if (!title?.trim()) {
      return res
        .status(400)
        .json({ error: "Title is required and cannot be empty." });
    }
    if (!content?.trim()) {
      return res
        .status(400)
        .json({ error: "Content is required and cannot be empty." });
    }
  }

  // PUT: at least one field must be present
  if (req.method === "PUT") {
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

  // Optional: Validate length constraints if fields are present
  if (title !== undefined) {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < MIN_TITLE_LENGTH) {
      return res
        .status(400)
        .json({
          error: `Title must be at least ${MIN_TITLE_LENGTH} characters.`,
        });
    }
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      return res
        .status(400)
        .json({
          error: `Title must be less than ${MAX_TITLE_LENGTH} characters.`,
        });
    }
  }

  if (content !== undefined) {
    const trimmedContent = content.trim();
    if (trimmedContent.length < MIN_CONTENT_LENGTH) {
      return res
        .status(400)
        .json({
          error: `Content must be at least ${MIN_CONTENT_LENGTH} characters.`,
        });
    }
    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      return res
        .status(400)
        .json({
          error: `Content must be less than ${MAX_CONTENT_LENGTH} characters.`,
        });
    }
  }

  req.validatedNote = {
    ...(title !== undefined && { title: title.trim() }),
    ...(content !== undefined && { content: content.trim() }),
    ...(authorName !== undefined && { authorName }),
    ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
  };

  next();
};

export { validateNoteId, validateNoteData };
