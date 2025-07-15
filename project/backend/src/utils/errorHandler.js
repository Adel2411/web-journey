import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Global error-handling middleware
export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Prisma-specific errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return res.status(409).json({
          success: false,
          message: 'Note already exists',
          code: error.code,
        });

      case 'P2025': // Record not found
        return res.status(404).json({
          success: false,
          message: 'Note not found',
          code: error.code,
        });
    }
  }

  // Custom thrown app errors via httpError()
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code || undefined,
    });
  }

  // Unknown / unexpected errors
  return res.status(500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

// throw custom errors
export const httpError = (message, statusCode = 500, code = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
};
