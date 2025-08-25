import { noteCreationValidation } from "../utils/noteValidator.js";

// CREATE-note validation middleware
export const createNoteValidator = (req, res, next) => {
  try {
    req.body = noteCreationValidation.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Create Note validation failed",
        errors: error.flatten().fieldErrors,
      });
    }
    next(error);
  }
};

// UPDATE-note validation middleware
export const updateNoteValidator = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      message: "Update Note validation failed",
      errors: { general: ["Request body is missing or invalid"] },
    });
  }

  const noteUpdateValidation = noteCreationValidation
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    });

  try {
    req.body = noteUpdateValidation.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Check if the error is specifically for "at least one field"
      const hasNoFieldsError = error.errors.some(
        (e) =>
          e.path.length === 0 &&
          e.message === "At least one field must be provided for update",
      );
      return res.status(400).json({
        success: false,
        message: "Update Note validation failed",
        errors: hasNoFieldsError
          ? { general: ["At least one field must be provided for update"] }
          : error.flatten().fieldErrors,
      });
    }
    next(error);
  }
};

// Note-ID validator
export const validateNoteId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
      errors: { id: ["Note ID must be a positive integer"] },
    });
  }
  next();
};
