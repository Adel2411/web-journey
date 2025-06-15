
const validatePost = (req, res, next) => {
  const { method } = req;
  const { title, content, author } = req.body;

  
   // Vérifie que chaque champ est présent et bien une chaîne de caractères  POUR POST
  if (method === "POST") {
    const missingFields = [];// Tableau pour stocker les champs manquants ou invalides

   
    if (!title || typeof title !== "string") missingFields.push("title");
    if (!content || typeof content !== "string") missingFields.push("content");
    if (!author || typeof author !== "string") missingFields.push("author");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: `Missing or invalid fields: ${missingFields.join(", ")}`,
      });
    }
  }

  // On accepte que le client envoie seulement un ou plusieurs champs valides (title, content, author)  POUR PUT 
  if (method === "PUT") {
    const hasValidField =
      (title && typeof title === "string") ||
      (content && typeof content === "string") ||
      (author && typeof author === "string");

    if (!hasValidField) {
      return res.status(400).json({
        error: "Validation failed",
        message: "At least one non-empty string field (title, content, author) must be provided",
      });
    }
  }

  next();
};

export default validatePost;

/**Vérifie que les champs sont valides (selon POST/PUT) */