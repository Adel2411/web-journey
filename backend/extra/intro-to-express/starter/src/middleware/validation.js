export function validatePost(req, res, next) {
    const {title, content, author} =req.body;

    // check if fields are missing :
    const missingFields = [];
    if (!title || typeof title !== "string" || title.trim() === "") {
        missingFields.push("title");
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
        missingFields.push("content");
    }
    if (!author || typeof author !== "string" || author.trim() === "") {
        missingFields.push("author");
    }

    //if any fields are missing return error
    if (missingFields.length > 0) {
        return res.status(400).json({ error: "Validation failed", message: 
            'Missing or invalid fields: ${missingFields.join(", ")}'
        });
    }
    // to continue to next middlware if all fields are valid
    next();
};

export function validatePut(req, res, next) {
    const { title, content, author } = req.body;
    // to check if one or more fields are present
    if (!title && !content && !author) {
        return res.status(400).json({ error: "Validation failed", 
            message: "At least one field must be changed"
        });
    }
    // to check if modified fields are not empty strings 
    const invalidFields = [];
    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
        invalidFields.push("title");
    }
    if (content !== undefined && (typeof content !== "string" || content.trim() === "")) {
        invalidFields.push("content");
    }
    if (author !== undefined && (typeof author !== "string" || author.trim() === "")) {
        invalidFields.push("author");
    }
    if (invalidFields.length > 0) {
        return res.status(400).json({ error: "Validation failed", 
            message: "Invalid fields: " + invalidFields.join(", ")
        });
    }
    next();
};