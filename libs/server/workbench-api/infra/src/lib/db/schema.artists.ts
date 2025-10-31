import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const ArtistsStatusEnum = pgEnum('artists_status_enum', [
  'active',
  'archived',
]);

export const artistsTable = pgTable('artists', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  country: text('country'),
  // enum column wired below
  status: ArtistsStatusEnum('status').notNull(),
  formed_at: timestamp('formed_at', { withTimezone: true }),
  website: text('website'),
  external_id: uuid('external_id'),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
