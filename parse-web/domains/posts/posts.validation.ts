import { z } from "zod";

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

const postContentSchema = z
  .string()
  .min(1, "Content cannot be empty")
  .refine(
    (content) => countWords(content) <= 100,
    "Post content must be 100 words or less"
  );

export const createPostSchema = z.object({
  authorId: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .optional()
    .transform((val) => val || "Untitled"),
  content: postContentSchema,
  isDraft: z.boolean().default(true),
  visibility: z.enum(["public", "followers", "private"]).default("public"),
  topic: z.string().max(50).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .optional(),
  content: postContentSchema.optional(),
  isDraft: z.boolean().optional(),
  visibility: z.enum(["public", "followers", "private"]).optional(),
  topic: z.string().max(50).optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// For client-side validation feedback
export const validateWordCount = (
  content: string
): {
  isValid: boolean;
  count: number;
  message?: string;
} => {
  const count = countWords(content);
  return {
    isValid: count <= 100,
    count,
    message:
      count > 100
        ? `${count}/100 words - please reduce by ${count - 100}`
        : `${count}/100 words`,
  };
};
