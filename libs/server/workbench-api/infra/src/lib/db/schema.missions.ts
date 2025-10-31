import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { agentsTable } from './schema.agents';

export const MissionsStatusEnum = pgEnum('missions_status_enum', [
  'planned',
  'active',
  'paused',
  'completed',
  'failed',
]);

export const missionsTable = pgTable('missions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  // enum column wired below
  status: MissionsStatusEnum('status').notNull(),
  risk_level: integer('risk_level'),
  eta: timestamp('eta', { withTimezone: true }),

  agent_id: uuid('agent_id')
    .notNull()
    .references(() => agentsTable.id, {
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
