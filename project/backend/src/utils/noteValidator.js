import { z } from "zod";
import { httpError } from "./errorHandler.js";

// Create validation schema
const createSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(1000),
  author: z.string().max(100).optional(),
  isPublic: z.boolean().optional(),
});

// Update validation schema
const updateSchema = createSchema.partial();

export function createNoteValidator(req, res, next) {
  const result = createSchema.safeParse(req.body);
  if (!result.success) {
    return next(httpError("Invalid data", 400, "VALIDATION_ERROR"));
  }
  next();
}

export function updateNoteValidator(req, res, next) {
  const result = updateSchema.safeParse(req.body);
  if (!result.success || Object.keys(req.body).length === 0) {
    return next(httpError("Invalid or empty update data", 400, "VALIDATION_ERROR"));
  }
  next();
}

export function validateNoteId(req, res, next) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return next(httpError("Invalid note ID", 400, "VALIDATION_ERROR"));
  }
  next();
}
