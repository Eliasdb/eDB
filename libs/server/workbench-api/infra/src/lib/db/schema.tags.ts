import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const tagsTable = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull().unique(),

  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
