import { Prisma } from '@prisma/client';
import { errorResponse } from './responseFormatter.js';

export function handlePrismaError(error, res, fallbackMessage = "Something went wrong") {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        return errorResponse(res, 404, "Record not found");
      case 'P2002':
        return errorResponse(res, 409, "Unique constraint failed");
      case 'P2003':
        return errorResponse(res, 400, "Foreign key constraint failed");
      default:
        return errorResponse(res, 400, `Database error: ${error.code}`);
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("Database failed to initialize:", error.message);
    return errorResponse(res, 500, "Database initialization failed");
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    console.error("Unknown Prisma request error:", error.message);
    return errorResponse(res, 500, "Unknown database error");
  }

  // Fallback
  return errorResponse(res, 500, fallbackMessage);
}
