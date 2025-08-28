import { z } from "zod";
import { noteCreationValidation } from "../utils/noteValidator.js";
import { httpError } from "../utils/errorHandler.js";

// CREATE-note validation middleware
export const createNoteValidator = (req, res, next) => {
  try {
    req.body = noteCreationValidation.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(
        httpError(
          "Create Note validation failed",
          400,
          "VALIDATION_ERROR",
          error.flatten().fieldErrors
        )
      );
    }
    next(error);
  }
};

// UPDATE-note validation middleware
export const updateNoteValidator = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") {
    return next(
      httpError("Update Note validation failed", 400, "VALIDATION_ERROR", {
        general: ["Request body is missing or invalid"],
      })
    );
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
          e.message === "At least one field must be provided for update"
      );
      const details = hasNoFieldsError
        ? { general: ["At least one field must be provided for update"] }
        : error.flatten().fieldErrors;
      return next(
        httpError(
          "Update Note validation failed",
          400,
          "VALIDATION_ERROR",
          details
        )
      );
    }
    next(error);
  }
};

// Note-ID validator
export const validateNoteId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(
      httpError("Invalid note ID", 400, "VALIDATION_ERROR", {
        id: ["Note ID must be a positive integer"],
      })
    );
  }
  next();
};

// SHARE-note validation middleware
export const validateShareBody = (req, res, next) => {
  const schema = z.object({
    userId: z.number().int().positive(),
    canEdit: z.boolean().optional(),
  });
  try {
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return next(
        httpError(
          "Share Note validation failed",
          400,
          "VALIDATION_ERROR",
          parsed.error.flatten().fieldErrors
        )
      );
    }
    req.body = parsed.data;
    next();
  } catch (err) {
    next(err);
  }
};
