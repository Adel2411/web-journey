import { body, validationResult } from "express-validator";

const validateNewPost = [
  
  body("title")
    .exists().withMessage("Title is required")
    .bail()
    .notEmpty().withMessage("Title cannot be empty")
    .bail()
    .isString().withMessage("Title must be text"),

  
  body("content")
    .exists().withMessage("Content is required")
    .bail()
    .notEmpty().withMessage("Content cannot be empty")
    .bail()
    .isString().withMessage("Content must be text"),

  body("author")
    .exists().withMessage("Author is required")
    .bail()
    .notEmpty().withMessage("Author cannot be empty")
    .bail()
    .isString().withMessage("Author must be text"),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateNewPost;