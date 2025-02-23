# Stage 1: Composer Build Stage
FROM composer:2 AS build

# Set working directory
WORKDIR /app

# Copy the entire project first (including artisan)
COPY . .

# Install dependencies
RUN composer install --no-dev --prefer-dist --optimize-autoloader

# Stage 2: Runtime (PHP-FPM)
FROM php:8.1-fpm-alpine AS runtime

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    postgresql-client \
    libpng \
    libzip-dev \
    libxml2-dev \
    unzip \
    curl

# Set working directory
WORKDIR /var/www

# Copy the application from the build stage
COPY --from=build /app /var/www

# Set permissions for Laravel directories
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Copy wait-for-postgres.sh to wait for database readiness
COPY wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN chmod +x /usr/local/bin/wait-for-postgres.sh

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM after waiting for PostgreSQL
ENTRYPOINT ["/usr/local/bin/wait-for-postgres.sh", "postgres-service-staging", "5432", "php-fpm"]
