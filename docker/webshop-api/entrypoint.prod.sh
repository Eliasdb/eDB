#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."
./wait-for-postgres.sh postgres-service-prod
echo "✅ PostgreSQL is ready"

echo "🚀 Running migrations..."
php artisan migrate:fresh --force || { echo "❌ migrate:fresh failed"; exit 1; }
echo "✅ Migrations done"

echo "🌱 Seeding books..."
php artisan db:seed --class=CuratedBooksSeeder --force || { echo "❌ Seeder failed"; exit 1; }
echo "✅ Seeder completed"

echo "📡 Starting PHP-FPM..."
php-fpm -D || { echo "❌ PHP-FPM failed to start"; exit 1; }

echo "🌍 Starting NGINX..."
exec nginx -g 'daemon off;'
