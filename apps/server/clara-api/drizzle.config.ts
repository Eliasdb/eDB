import 'dotenv/config';

export default {
  schema: './src/domain/db/schema.ts', // we'll create this
  out: './drizzle', // where drizzle puts migrations/snapshots...
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // e.g. postgres://u:p@h:5432/db
  },
} as const;
