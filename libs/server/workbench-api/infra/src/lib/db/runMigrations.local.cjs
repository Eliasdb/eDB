const fs = require('node:fs');
const path = require('node:path');
const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');

// 1. load env from the *infra root*, not from src/
const infraRoot = path.resolve(__dirname, '../../..'); // .../infra
require('dotenv').config({ path: path.join(infraRoot, '.env.local') });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL missing in env');
  }

  console.log('💾 using DATABASE_URL =', connectionString);

  // 2. connect
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  // 3. load & run all migrations in order
  const migrationsDir = path.resolve(infraRoot, 'src/lib/migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const contents = fs.readFileSync(fullPath, 'utf8');

    console.log(`⏳ Applying ${file}...`);
    await db.execute(contents);
    console.log(`✅ Done: ${file}`);
  }

  await sql.end();
  console.log('🎉 All migrations applied.');
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
