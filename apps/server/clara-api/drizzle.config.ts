import dotenv from 'dotenv';

// drizzle.config.ts
if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export default {
  schema: './src/infra/db/schema.ts', // we'll create this
  out: './drizzle', // where drizzle puts migrations/snapshots...
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl, // e.g. postgres://u:p@h:5432/db
  },
} as const;
