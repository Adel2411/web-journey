import { body, validationResult } from 'express-validator';

export const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "Unprocessable Content",
            errors: errors.array()
        });
    }
    next();
};

// Validates incoming requests without external libraries
export const createUserValidator = [
    body('title')
        .exists()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Title must be between 3 and 20 characters'),

    body('content')
        .exists()
        .withMessage('Content is required')
        .isString()
        .withMessage('Content must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Content must be between 3 and 100 characters'),

    body('author')
        .exists()
        .withMessage('Author is required')
        .isString()
        .withMessage('Author must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Author must be between 3 and 20 characters')
];

export const updateValidator = [
    body('title')
        .optional()
        .isString()
        .withMessage('Title must be a string')
        .isLength({ min: 3, max: 50 })
        .withMessage('Title must be between 3 and 20 characters'),

    body('content')
        .optional()
        .isString()
        .withMessage('Content must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Content must be between 3 and 100 characters'),

    body('author')
        .optional()
        .isString()
        .withMessage('Author must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Author must be between 3 and 20 characters')
];