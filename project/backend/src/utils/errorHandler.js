import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Helper: create an Error with HTTP metadata, machine code, and optional details payload
export const httpError = (
  message,
  statusCode = 500,
  code = null,
  details = undefined
) => {
  const err = new Error(message || "Error");
  err.statusCode = statusCode;
  if (code) err.code = code;
  if (details !== undefined) err.details = details;
  return err;
};

// Global error-handling middleware with a consistent envelope
export const errorHandler = (error, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("Error:", error);

  const requestId = req.headers["x-request-id"]; // pass-through if present

  // Zod validation errors
  if (error?.name === "ZodError" && typeof error.flatten === "function") {
    const details = error.flatten().fieldErrors;
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed.",
        details,
      },
      status: 400,
      ...(requestId ? { requestId } : {}),
    });
  }

  // Prisma-specific errors
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // Unique constraint failed
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "Unique constraint failed.",
          details: { prisma: { code: error.code, target: error.meta?.target } },
        },
        status: 409,
        ...(requestId ? { requestId } : {}),
      });
    }
    if (error.code === "P2025") {
      // Record not found
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Resource not found.",
          details: { prisma: { code: error.code } },
        },
        status: 404,
        ...(requestId ? { requestId } : {}),
      });
    }
  }

  // Custom thrown app errors via httpError()
  if (error?.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code || inferCodeFromStatus(error.statusCode),
        message: error.message || inferMessageFromStatus(error.statusCode),
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
      status: error.statusCode,
      ...(requestId ? { requestId } : {}),
    });
  }

  // Unknown / unexpected errors
  const status = 500;
  return res.status(status).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: error?.message || "Internal server error",
    },
    status,
    ...(requestId ? { requestId } : {}),
  });
};

function inferCodeFromStatus(status) {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHENTICATED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "UNPROCESSABLE_ENTITY";
    case 429:
      return "RATE_LIMITED";
    case 423:
      return "LOCKED";
    default:
      return "ERROR";
  }
}

function inferMessageFromStatus(status) {
  switch (status) {
    case 400:
      return "Bad request.";
    case 401:
      return "Authentication required.";
    case 403:
      return "Forbidden.";
    case 404:
      return "Resource not found.";
    case 409:
      return "Conflict.";
    case 422:
      return "Unprocessable entity.";
    case 429:
      return "Too many requests.";
    case 423:
      return "Locked.";
    default:
      return "Error.";
  }
}
