import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Physical table in Postgres.
// We can keep snake_case here. This file is *not* the API contract.
// It's "how it's stored".
export const authorsTable = pgTable('authors', {
  id: uuid('id').primaryKey().defaultRandom(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),

  bio: text('bio'),
  isActive: boolean('is_active').notNull().default(true),

  created_at: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updated_at: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
