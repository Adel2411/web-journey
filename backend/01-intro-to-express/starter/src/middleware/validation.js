export function validation(req, res, next) {
  const { title, content, author } = req.body;

  const missingFields = [];

  if (req.method === "POST") {
    if (typeof title !== "string" || title.trim() === ""){
        missingFields.push("title")
    };
    if (typeof content !== "string" || content.trim() === "")
        {missingFields.push("content")
            
        };
    if (typeof author !== "string" || author.trim() === ""){
        missingFields.push("author")
        };

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
  }

  if (req.method === "PUT") {
    const validFields = [title, content, author].filter(
      field => typeof field === "string" && field.trim() !== ""
    );

    if (validFields.length === 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: "At least one valid field (title, content, author) must be provided",
      });
    }
  }

  next();
}