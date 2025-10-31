import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { artistsTable } from './schema.artists';

export const AlbumsStatusEnum = pgEnum('albums_status_enum', [
  'draft',
  'published',
  'archived',
]);

export const albumsTable = pgTable('albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  // enum column wired below
  status: AlbumsStatusEnum('status').notNull(),
  published_year: integer('published_year'),

  artist_id: uuid('artist_id')
    .notNull()
    .references(() => artistsTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),

  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
