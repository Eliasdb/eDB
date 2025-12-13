import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const GadgetsCategoryEnum = pgEnum('gadgets_category_enum', [
  'surveillance',
  'infiltration',
  'comms',
  'medical',
]);

export const gadgetsTable = pgTable('gadgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  // enum column wired below
  category: GadgetsCategoryEnum('category').notNull(),
  weight_gr: integer('weight_gr'),
  discontinued: boolean('discontinued'),
  released_at: timestamp('released_at', { withTimezone: true }),

  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
