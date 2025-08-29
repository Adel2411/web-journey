import { z } from "zod";

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;
const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 1000;

export const noteCreationValidation = z.object({
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
