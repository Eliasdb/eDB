#!/bin/sh
set -e

# Wait for PostgreSQL
./wait-for-postgres.sh postgres-service-staging

# Run migrations
php artisan migrate 

# Start PHP-FPM and Nginx
php-fpm -D
exec nginx -g 'daemon off;'
