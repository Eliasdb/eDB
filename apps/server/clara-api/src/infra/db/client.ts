import dotenv from 'dotenv';

// drizzle.config.ts
if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
export type Db = typeof db;
