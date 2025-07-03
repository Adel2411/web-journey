import { body, validationResult } from "express-validator";

// POST Validator
export const postValidator = [

  body('id')
    .isInt().withMessage('Invalid ID type!'),

  body('title')
    .isString().withMessage('Title must be a string')
    .notEmpty().withMessage('Title is required'),

  body('content')
    .isString().withMessage('Content must be a string')
    .notEmpty().withMessage('Content is required'),

  body('author')
    .isString().withMessage('Author must be a string')
    .notEmpty().withMessage('Author is required'),


  // Error handler middleware
  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({

        error: "Validation failed",
        message: errors.array().map(err => err.msg).join(", ")

      });
    }
    next(); 
  }
];


// PUT Validator
export const putValidator = [

  body('id')
    .optional()
    .isInt().withMessage('Invalid ID type!'),

  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .notEmpty().withMessage('Title cannot be empty'),

  body('content')
    .optional()
    .isString().withMessage('Content must be a string')
    .notEmpty().withMessage('Content cannot be empty'),

  body('author')
    .optional()
    .isString().withMessage('Author must be a string')
    .notEmpty().withMessage('Author cannot be empty'),


  // Error handler middleware
  (req, res, next) => {

    const { title, content, author } = req.body;
    const errors = validationResult(req);

    if (!title && !content && !author) {
        
      return res.status(400).json({
        error: "Validation failed",
        message: "At least one of the following fields must be provided: title, content, author"
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        message: errors.array().map(err => err.msg).join(", ")
      });
    }

    next();
  }
];
