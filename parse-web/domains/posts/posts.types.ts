import { Post, Person } from '@/db/schema';

// Post with author information joined
export type PostWithAuthor = Post & {
  author: Person;
};

// Re-export schema types for convenience
export type { Post, Person } from '@/db/schema';
