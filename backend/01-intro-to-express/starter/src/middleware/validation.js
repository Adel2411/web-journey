
// validating POST /posts
export const validatePost = (req, res, next) => {
  const { title, content, author } = req.body;
  const missingFields = [];

  // check if title exist , string and not empty
  if (!title || typeof title !== 'string' || title.trim() === '') {
    missingFields.push('title');
  }
  // check if content exist , string and not empty
  if (!content || typeof content !== 'string' || content.trim() === '') {
    missingFields.push('content');
  }
  // check if author exist , string and not empty
  if (!author || typeof author !== 'string' || author.trim() === '') {
    missingFields.push('author');
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: `Missing or invalid fields: ${missingFields.join(', ')}`
    });
  }

  next(); 
};

// validating PUT /posts/:id
export const validateUpdatePost = (req, res, next) => {
  const { title, content, author } = req.body;

  //check if one field exist
  if (!title && !content && !author) {
    return res.status(400).json({
      error: "Validation failed",
      message: "At least one field (title, content, or author) must be provided"
    });
  }

  // Check that provided fields are non-empty strings
  const invalidFields = [];
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    invalidFields.push('title');
  }
  if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
    invalidFields.push('content');
  }
  if (author !== undefined && (typeof author !== 'string' || author.trim() === '')) {
    invalidFields.push('author');
  }

  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: `Invalid fields: ${invalidFields.join(', ')}`
    });
  }
  next();
};
