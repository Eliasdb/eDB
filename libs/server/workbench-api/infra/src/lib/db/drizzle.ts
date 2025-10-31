import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// ─────────────────────────────────────────────
// Import your schema tables
// ─────────────────────────────────────────────
import { albumsTable } from './schema.albums';
import { artistsTable } from './schema.artists';
import { authorsTable } from './schema.authors';
import { booksTable } from './schema.books';
import { bookTagsTable } from './schema.bookTags';
import { tagsTable } from './schema.tags';
import { agentsTable } from './schema.agents';
import { missionsTable } from './schema.missions';

// ─────────────────────────────────────────────
// Connection setup
// ─────────────────────────────────────────────
const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Limit connection pool size for tests & dev
const client = postgres(connectionString, { max: 1 });

// ─────────────────────────────────────────────
// Typed Drizzle instance with schema
// ─────────────────────────────────────────────
export const db = drizzle(client, {
  schema: {
    authorsTable,
    booksTable,
    tagsTable,
    bookTagsTable,
    albumsTable,
    artistsTable,
    agentsTable,
    missionsTable,
  },
});

// ─────────────────────────────────────────────
// Optional: export schema as a single object for reuse
// (e.g., for migrations, tests, etc.)
// ─────────────────────────────────────────────
export const schema = {
  authorsTable,
  booksTable,
  tagsTable,
  bookTagsTable,
  albumsTable,
  artistsTable,
  agentsTable,
  missionsTable,
};
