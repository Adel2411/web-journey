import { z } from "zod";
import { fail } from "../utils/response.js";

// Note schema (moved from utils/noteValidator.js)
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;
const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 1000;

const noteCreationValidation = z.object({
  title: z
    .string()
    .trim()
    .min(
      MIN_TITLE_LENGTH,
      `Title must be at least ${MIN_TITLE_LENGTH} characters long`
    )
    .max(
      MAX_TITLE_LENGTH,
      `Title must be at most ${MAX_TITLE_LENGTH} characters long`
    ),

  content: z
    .string()
    .trim()
    .min(
      MIN_CONTENT_LENGTH,
      `Content must be at least ${MIN_CONTENT_LENGTH} characters long`
    )
    .max(
      MAX_CONTENT_LENGTH,
      `Content must be at most ${MAX_CONTENT_LENGTH} characters long`
    ),

  isPublic: z.boolean().optional(),
});

// CREATE-note validation middleware
export const createNoteValidator = (req, res, next) => {
  try {
    req.body = noteCreationValidation.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail(
        res,
        "Create Note validation failed",
        400,
        "VALIDATION_ERROR",
        { errors: error.flatten().fieldErrors }
      );
    }
    next(error);
  }
};

// UPDATE-note validation middleware
export const updateNoteValidator = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") {
    return fail(res, "Update Note validation failed", 400, "VALIDATION_ERROR", {
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
          e.message === "At least one field must be provided for update"
      );
      const errors = hasNoFieldsError
        ? { general: ["At least one field must be provided for update"] }
        : error.flatten().fieldErrors;
      return fail(
        res,
        "Update Note validation failed",
        400,
        "VALIDATION_ERROR",
        { errors }
      );
    }
    next(error);
  }
};

// Note-ID validator
export const validateNoteId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return fail(res, "Invalid note ID", 400, "VALIDATION_ERROR", {
      errors: { id: ["Note ID must be a positive integer"] },
    });
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
      return fail(
        res,
        "Share Note validation failed",
        400,
        "VALIDATION_ERROR",
        { errors: parsed.error.flatten().fieldErrors }
      );
    }
    req.body = parsed.data;
    next();
  } catch (err) {
    next(err);
  }
};

// Optional: export schema for reuse in tests or other modules
export { noteCreationValidation };
