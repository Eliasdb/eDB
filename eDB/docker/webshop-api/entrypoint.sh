#!/bin/sh
set -e

# Wait for Postgres to accept connections
./wait-for-postgres.sh postgres-service-staging

# Apply only new migrations
php artisan migrate --force

# Seed curated books (truncates books table on purpose)
php artisan db:seed --class=CuratedBooksSeeder --force

# Cache config/routes if you want startup perf (optional)
# php artisan config:cache
# php artisan route:cache

# Launch services
php-fpm -D
exec nginx -g 'daemon off;'
