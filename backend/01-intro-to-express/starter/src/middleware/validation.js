export function validatePost(req, res, next) {
    const {title, content, author} = req.body;
    const missingFields = [];

    if (!title || typeof title !== 'string' || title.trim() === '') missingFields.push('title');
    if (!content || typeof content !== 'string' || content.trim() === '') missingFields.push('content');
    if (!author || typeof author !== 'string' || author.trim() === '') missingFields.push('author');

    if (missingFields.length > 0) {
        return res.status(400).json({
            error : "Validation failed",
            message : `Missing required fields: ${missingFields.join(", ")}`
        });
    }
    next();
}

export function validatePut(req, res, next) {
    const {title, content, author} = req.body;
    const providedFields = [];

    if (title !== undefined && !(typeof title !== 'string' || title.trim() === '')) {providedFields.push('title');}
    if (content !== undefined && !(typeof content !== 'string' || content.trim() === '')) {providedFields.push('content');}
    if (author !== undefined && !(typeof author !== 'string' || author.trim() === '')) {providedFields.push('author');}


    if (providedFields.length === 0) {
        return res.status(400).json({
            error: "Validation failed",
            message: "At least one field (title, content, author) must be provided and valid"
        });
    }
    next();
}