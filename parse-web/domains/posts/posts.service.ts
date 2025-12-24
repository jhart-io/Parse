import { db } from "@/db";
import { posts } from "@/db/schema";
import { createPostSchema } from "./posts.validation";
import { PostWithAuthor } from "./posts.types";
import { eq, desc } from "drizzle-orm";

/**
 * Create a new post
 */
export async function createPost(data: {
  authorId: string;
  title?: string;
  content: string;
  isDraft: boolean;
  visibility: "public" | "followers" | "private";
  topic?: string;
}) {
  // Validate input (this will transform title to "Untitled" if empty)
  const validated = createPostSchema.parse(data);

  // Insert post
  const [post] = await db
    .insert(posts)
    .values({
      authorId: data.authorId,
      title: validated.title,
      content: validated.content,
      isDraft: validated.isDraft,
      visibility: validated.visibility,
      topic: validated.topic,
    })
    .returning();

  return post;
}

/**
 * Get all published posts with author information
 */
export async function getPublishedPosts(options?: {
  limit?: number;
  offset?: number;
}): Promise<PostWithAuthor[]> {
  const result = await db.query.posts.findMany({
    where: eq(posts.isDraft, false),
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
    limit: options?.limit,
    offset: options?.offset,
  });

  return result as PostWithAuthor[];
}

/**
 * Get draft posts by author
 */
export async function getDraftsByAuthor(
  authorId: string
): Promise<PostWithAuthor[]> {
  const result = await db.query.posts.findMany({
    where: (posts, { eq, and }) =>
      and(eq(posts.authorId, authorId), eq(posts.isDraft, true)),
    with: {
      author: true,
    },
    orderBy: [desc(posts.updatedAt)],
  });

  return result as PostWithAuthor[];
}

/**
 * Get published posts by author
 */
export async function getPublishedPostsByAuthor(
  authorId: string
): Promise<PostWithAuthor[]> {
  const result = await db.query.posts.findMany({
    where: (posts, { eq, and }) =>
      and(eq(posts.authorId, authorId), eq(posts.isDraft, false)),
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
  });

  return result as PostWithAuthor[];
}

/**
 * Get a post by ID with author information
 */
export async function getPostById(
  postId: string
): Promise<PostWithAuthor | null> {
  const result = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    with: {
      author: true,
    },
  });

  return result as PostWithAuthor | null;
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string,
  data: {
    title?: string;
    content?: string;
    isDraft?: boolean;
    visibility?: "public" | "followers" | "private";
    topic?: string;
  }
) {
  const [updatedPost] = await db
    .update(posts)
    .set({
      ...data,
      lastModifiedAt: new Date(),
    })
    .where(eq(posts.id, postId))
    .returning();

  return updatedPost;
}

/**
 * Delete a post by ID
 */
export async function deletePost(postId: string) {
  const [deletedPost] = await db
    .delete(posts)
    .where(eq(posts.id, postId))
    .returning();

  return deletedPost;
}
