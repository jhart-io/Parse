import { db } from '@/db';
import { posts } from '@/db/schema';
import { createPostSchema } from './posts.validation';
import { PostWithAuthor } from './posts.types';
import { eq, desc } from 'drizzle-orm';

/**
 * Create a new post
 */
export async function createPost(data: {
  authorId: string;
  title?: string;
  content: string;
  isDraft: boolean;
  visibility: 'public' | 'followers' | 'private';
  topic?: string;
}) {
  // Validate input (this will transform title to "Untitled" if empty)
  const validated = createPostSchema.parse(data);

  // Insert post
  const [post] = await db.insert(posts).values({
    authorId: data.authorId,
    title: validated.title,
    content: validated.content,
    isDraft: validated.isDraft,
    visibility: validated.visibility,
    topic: validated.topic,
  }).returning();

  return post;
}

/**
 * Get all published posts with author information
 */
export async function getPublishedPosts(options?: { limit?: number; offset?: number }): Promise<PostWithAuthor[]> {
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
export async function getDraftsByAuthor(authorId: string): Promise<PostWithAuthor[]> {
  const result = await db.query.posts.findMany({
    where: (posts, { eq, and }) => and(
      eq(posts.authorId, authorId),
      eq(posts.isDraft, true)
    ),
    with: {
      author: true,
    },
    orderBy: [desc(posts.updatedAt)],
  });

  return result as PostWithAuthor[];
}
