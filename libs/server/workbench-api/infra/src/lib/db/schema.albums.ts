import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status_enum', [
  'draft',
  'published',
  'archived',
]);

export const albumsTable = pgTable('albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  author_id: uuid('author_id').notNull(),
  // enum column wired below
  status: statusEnum('status').notNull(),
  published_year: integer('published_year'),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
