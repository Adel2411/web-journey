export default function validation(req, res, next) {
  // Helper function to check if a value is a non-empty string
  const isNonEmptyString = (value) =>
    typeof value === 'string' && value.trim().length > 0;

  if (req.method === 'POST') {
    const { title, content, author } = req.body;

    // Collect missing or invalid fields
    const errors = [];
    if (!isNonEmptyString(title)) {
      errors.push('title');
    }
    if (!isNonEmptyString(content)) {
      errors.push('content');
    }
    if (!isNonEmptyString(author)) {
      errors.push('author');
    }

    // Return error if any fields are invalid
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: `Missing or invalid required fields: ${errors.join(', ')}`,
      });
    }
  } else if (req.method === 'PUT') {
    const { title, content, author } = req.body;

    // Check if at least one field is provided
    if (!title && !content && !author) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'At least one field (title, content, or author) is required to update',
      });
    }

    // Validate provided fields
    const errors = [];
    if (title !== undefined && !isNonEmptyString(title)) {
      errors.push('title');
    }
    if (content !== undefined && !isNonEmptyString(content)) {
      errors.push('content');
    }
    if (author !== undefined && !isNonEmptyString(author)) {
      errors.push('author');
    }

    // Return error if any provided fields are invalid
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: `Invalid fields: ${errors.join(', ')} must be non-empty strings`,
      });
    }
  }

  // Proceed to the next middleware if validation passes
  next();
}