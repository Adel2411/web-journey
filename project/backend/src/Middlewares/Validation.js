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

export const validateUser = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name shouldn't be empty")
    .isLength({ min: 3 }).withMessage("The name should be more than 3 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email shouldn't be empty")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password shouldn't be empty")
    .isLength({ min: 6 }).withMessage("The password should be more than 6 characters"),

  body("age")
    .notEmpty().withMessage("Age shouldn't be empty")
    .isInt({ min: 0 }).withMessage("Invalid age format")
    .custom((value) => {
      if (value < 18) {
        throw new Error("Age must be at least 18");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateExistingUser = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email shouldn't be empty")
    .isEmail().withMessage("Invalid email format"),
   
  body("password")
    .trim()
    .notEmpty().withMessage("Password shouldn't be empty")
    .isLength({ min: 6 }).withMessage("The password should be more than 6 characters"),  

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
  
]