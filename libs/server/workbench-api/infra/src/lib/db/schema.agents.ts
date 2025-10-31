import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const AgentsStatusEnum = pgEnum('agents_status_enum', [
  'active',
  'inactive',
  'retired',
]);

export const agentsTable = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  codename: text('codename').notNull(),
  // enum column wired below
  status: AgentsStatusEnum('status').notNull(),
  clearance: integer('clearance'),
  specialty: text('specialty'),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
