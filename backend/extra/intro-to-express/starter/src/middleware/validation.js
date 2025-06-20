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
  }

  next();
};

export default validatePost;