#!/bin/sh
set -e

# Wait for PostgreSQL
./wait-for-postgres.sh postgres-service-prod

# Run migrations
# php artisan migrate --force
# php artisan db:seed --force


# Start PHP-FPM and Nginx
php-fpm -D
exec nginx -g 'daemon off;'
