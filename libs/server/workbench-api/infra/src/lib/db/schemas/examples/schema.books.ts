import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authorsTable } from './schema.authors';

export const booksTable = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),

  authorId: uuid('author_id')
    .notNull()
    .references(() => authorsTable.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),
  publishedYear: integer('published_year'),

  status: text('status').notNull().default('draft'),

  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
