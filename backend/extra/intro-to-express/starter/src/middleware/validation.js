const validatePost = (req, res, next) => {
  const { title, content, author } = req.body;
  const missingFields = [];

  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      missingFields.push('title');
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      missingFields.push('content');
    }
    if (!author || typeof author !== 'string' || author.trim() === '') {
      missingFields.push('author');
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
  }

  // Check for PUT requests - at least one field must be provided
  if (req.method === 'PUT') {
    const hasValidTitle = title && typeof title === 'string' && title.trim() !== '';
    const hasValidContent = content && typeof content === 'string' && content.trim() !== '';
    const hasValidAuthor = author && typeof author === 'string' && author.trim() !== '';

    if (!hasValidTitle && !hasValidContent && !hasValidAuthor) {
      return res.status(400).json({
        error: "Validation failed",
        message: "At least one field (title, content, or author) must be provided and non-empty"
      });
    }

    // Check if provided fields are valid strings
    if (title !== undefined && (!title || typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Title must be a non-empty string"
      });
    }
    if (content !== undefined && (!content || typeof content !== 'string' || content.trim() === '')) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Content must be a non-empty string"
      });
    }
    if (author !== undefined && (!author || typeof author !== 'string' || author.trim() === '')) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Author must be a non-empty string"
      });
    }
  }

  next(); // Continue to next middleware
};

export default validatePost;