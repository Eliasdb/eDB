// libs/server/workbench-api/infra/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.*.ts', // ← include all
  out: './src/lib/migrations',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
