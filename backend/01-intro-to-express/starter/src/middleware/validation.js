const validatePost = (req, res, next) => {
  // Check if the request body is present and has keys
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("Request body is missing.");
  }
  const { title, content, author } = req.body;
  const errors = [];

  // Validate each field
  // Ensure title, content, and author are non-empty strings
  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("Title is required and must be a non-empty string.");
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    errors.push("Content is required and must be a non-empty string.");
  }

  if (!author || typeof author !== "string" || author.trim() === "") {
    errors.push("Author is required and must be a non-empty string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validatePut = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send("Request body is missing.");
  }
  const { title, content, author } = req.body;

  const isEmpty = (val) => typeof val !== "string" || val.trim() === "";

  const providedFields = { title, content, author };

  const hasAnyField = Object.values(providedFields).some(
    (val) => val !== undefined
  );
  const allProvidedAreValid = Object.entries(providedFields).every(
    ([key, val]) => val === undefined || !isEmpty(val)
  );

  if (!hasAnyField) {
    return res.status(400).json({
      error: "Validation failed",
      message: "At least one field (title, content, author) must be provided.",
    });
  }

  if (!allProvidedAreValid) {
    const invalidFields = Object.entries(providedFields)
      .filter(([_, val]) => val !== undefined && isEmpty(val))
      .map(([key]) => key);

    return res.status(400).json({
      error: "Validation failed",
      message: `Provided fields cannot be empty: ${invalidFields.join(", ")}`,
    });
  }

  next();
};

export { validatePost, validatePut };
