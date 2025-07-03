import { body, validationResult } from "express-validator";

export const validateNote = [
    body("title")
    .trim()
    .notEmpty().withMessage("Title shouldn't be empty")
    .isLength({ min: 3 }).withMessage("The title should be more than 3 characters"),

    body("content")
    .trim()
    .notEmpty().withMessage("Content shouldn't be empty")
    .isLength({ min: 3 }).withMessage("The content should be more than 3 characters"),

    (req, res, next) => {
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
