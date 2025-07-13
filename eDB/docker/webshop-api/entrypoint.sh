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
echo "✅ Seeder completed"

# Optional cache
# php artisan config:cache
# php artisan route:cache

echo "📡 Starting PHP-FPM..."
php-fpm -D
exec nginx -g 'daemon off;'
