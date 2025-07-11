#!/bin/sh
set -e

# Wait for PostgreSQL
./wait-for-postgres.sh postgres-service-prod

# Run migrations (only new ones, don’t drop data)
php artisan migrate --force

# Run your custom book seeder (which truncates the books table itself)
php artisan db:seed --class=CuratedBooksSeeder

# Start PHP-FPM and Nginx
php-fpm -D
exec nginx -g 'daemon off;'
