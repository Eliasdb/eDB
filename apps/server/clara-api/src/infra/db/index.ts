// infra/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'mydatabase',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  ssl: false,
  max: 10, // tune later
  idleTimeoutMillis: 30_000,
});

export async function ping() {
  await pool.query('select 1');
}
