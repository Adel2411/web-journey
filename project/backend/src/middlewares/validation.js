import { body, validationResult } from 'express-validator'
import { validationErrorResponse } from "../utils/responseFormatter.js";

export const validator = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return validationErrorResponse(res, errors.array());
    }
    next();
}

export const noteValidators = (requireAll = true) => {
    const reqOrOpt = (field) => requireAll ? field : field.optional()

    return [
        reqOrOpt(body('title'))
            .exists({ checkNull: true }).withMessage('Title is required').bail()
            .notEmpty().withMessage('Title must not be empty').bail()
            .isString().withMessage('Title must be a string').bail()
            .trim()
            .isLength({ min: 3, max: 50 }).withMessage('Title must be 3-50 characters'),

        reqOrOpt(body('content'))
            .exists({ checkNull: true }).withMessage('Content is required').bail()
            .notEmpty().withMessage('Content must not be empty').bail()
            .isString().withMessage('Content must be a string').bail()
            .trim()
            .isLength({ min: 10, max: 500 }).withMessage('Content must be 10-500 characters'),

        reqOrOpt(body('authorName'))
            .exists({ checkNull: true }).withMessage('Author name is required').bail()
            .notEmpty().withMessage('Author name must not be empty').bail()
            .isString().withMessage('Author name must be a string').bail()
            .trim()
            .isLength({ min: 3, max: 100 }).withMessage('Author name must be 3-100 characters'),

        body('isPublic')
            .optional()
            .isBoolean()
            .withMessage('isPublic must be true or false'),
    ];
};
