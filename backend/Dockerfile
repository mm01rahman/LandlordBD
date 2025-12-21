# syntax=docker/dockerfile:1

FROM composer:2 AS vendor
WORKDIR /app

COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-interaction --no-progress --optimize-autoloader

# Copy the rest of your source
COPY . .
RUN composer dump-autoload --optimize

FROM php:8.2-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev git zip unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Set the document root to Laravel’s public folder
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Update Apache configuration to use the new document root
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/000-default.conf \
    /etc/apache2/sites-available/default-ssl.conf

# Copy built application from the vendor stage
WORKDIR /var/www/html
COPY --from=vendor /app /var/www/html

# Fix permissions for storage and bootstrap/cache
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && find storage bootstrap/cache -type d -exec chmod 775 {} \; \
    && find storage bootstrap/cache -type f -exec chmod 664 {} \;

# Add and configure the start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Default command
CMD ["/start.sh"]
