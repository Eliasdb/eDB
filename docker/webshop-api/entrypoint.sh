#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."
./wait-for-postgres.sh postgres-service-staging
echo "✅ PostgreSQL is ready"

echo "🔥 Wiping and re-running all migrations..."
php artisan migrate:fresh --force || { echo "❌ migrate:fresh failed"; exit 1; }
echo "✅ Database freshly migrated"

echo "🌱 Seeding curated books..."
php artisan db:seed --class=CuratedBooksSeeder --force || { echo "❌ Seeder failed"; exit 1; }
echo "✅ Curated books seeded"

echo "🧠 Setting Meilisearch filterable attributes..."
php artisan db:seed --class=MeilisearchIndexSeeder --force || { echo "❌ Meilisearch index seeding failed"; exit 1; }
echo "✅ Meilisearch index configured"

echo "📄 Generating OpenAPI spec..."
php artisan scramble:export || { echo "❌ Failed to export API spec"; exit 1; }
echo "✅ OpenAPI spec exported"

# Optional: config and route cache
# php artisan config:cache
# php artisan route:cache

echo "📡 Starting PHP-FPM..."
php-fpm -D
exec nginx -g 'daemon off;'
