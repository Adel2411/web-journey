import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { fail } from "./response.js";

// Global error-handling middleware
export const errorHandler = (error, req, res, next) => {
  console.error("Error:", error);

  // Prisma-specific errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // Unique constraint failed
        return fail(res, "Note already exists", 409, error.code);

      case "P2025": // Record not found
        return fail(res, "Note not found", 404, error.code);
    }
  }

  // Custom thrown app errors via httpError()
  if (error.statusCode) {
    return fail(res, error.message, error.statusCode, error.code || undefined);
  }

  // Unknown / unexpected errors
  return fail(res, error.message || "Internal server error", 500);
};

// throw custom errors
export const httpError = (message, statusCode = 500, code = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
};
