export function validationPostCreateBlogPost (req, res, next) { 
    const post =req.body;
    const wrongFileds = [];

    if (!post.title || typeof post.title !== "string" || post.title.trim() === "" ) 
        wrongFileds.push("title");

    if (!post.content || typeof post.content !== "string" || post.content.trim() === "")
        wrongFileds.push("content");

    if (!post.author || typeof post.author !== "string" || post.author.trim() === "")
        wrongFileds.push("author");

    if (wrongFileds.length > 0) {
        return res.status(400).json({
            error: "Validation failed",
            message: "Missing required fields:" + wrongFileds.join(", "),
        });
    }
    next();
}

export function validationPutUpdateBlogPostById (req, res, next) {
    const post = req.body;

      // Check if none of the fields are provided
    if (!post.title  && !post.content && !post.author) {
      return res.status(400).json({ error: "Validation failed", message: "At least one field (title, content, or author) must be provided",});
    }

    if (
       (post.title && (typeof post.title !== "string" || post.title.trim() === "")) ||
       (post.content && (typeof post.content !== "string" || post.content.trim() === "")) ||
       (post.author && (typeof post.author !== "string" || post.author.trim() === ""))) { 
        return res.status(400).json({ error: "Validation failed", message: "All provided fields must be non-empty strings",});
    }
    next();
}
