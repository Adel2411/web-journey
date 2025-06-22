import { body, validationResult } from "express-validator";

const validateNewPost = [
  body('title')
    .exists().withMessage('Title is required')
    .notEmpty().withMessage('Title cannot be empty')
    .isString().withMessage('Title must be a string'),

  body('content')
    .exists().withMessage('Content is required')
    .notEmpty().withMessage('Content cannot be empty')
    .isString().withMessage('Content must be a string'),

  body('author')
    .exists().withMessage('Author is required')
    .notEmpty().withMessage('Author cannot be empty')
    .isString().withMessage('Author must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export default validateNewPost;
