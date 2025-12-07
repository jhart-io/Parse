import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const visibilityEnum = pgEnum('visibility', ['public', 'followers', 'private']);
export const loginMethodEnum = pgEnum('login_method', ['password']);

// Account table - authentication
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  loginMethod: loginMethodEnum('login_method').notNull().default('password'),
});

// Person table - core user entity
export const persons = pgTable('persons', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }).unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Posts table - main feature
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').notNull().references(() => persons.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  isDraft: boolean('is_draft').notNull().default(true),
  visibility: visibilityEnum('visibility').notNull().default('public'),
  topic: varchar('topic', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastModifiedAt: timestamp('last_modified_at'),
});

// Relations for Drizzle's relational queries
export const accountsRelations = relations(accounts, ({ one }) => ({
  person: one(persons, {
    fields: [accounts.id],
    references: [persons.accountId],
  }),
}));

export const personsRelations = relations(persons, ({ one, many }) => ({
  account: one(accounts, {
    fields: [persons.accountId],
    references: [accounts.id],
  }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(persons, {
    fields: [posts.authorId],
    references: [persons.id],
  }),
}));

// TypeScript types derived from schema
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Person = typeof persons.$inferSelect;
export type NewPerson = typeof persons.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
