export function validationPostCreateBlogPost (req, res, next) { 
    const post =req.body;
    const wrongFileds = [];

    if (!title || typeof title !== "string" || post.title.trim() === "" ) 
        wrongFileds.push("title");

    if (!content || typeof content !== "string" || post.content.trim() === "")
        wrongFileds.push("content");

    if (!author || typeof author !== "string" || post.author.trim() === "")
        wrongFileds.push("author");

    if (wrongFileds.length > 0) {
        return res.status(400).json({
            error: "Validation failed",
            message: "Missing required fields:" + wrongFileds.join(", "),
        });
    }
    next();
}