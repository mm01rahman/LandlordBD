#!/usr/bin/env bash
set -e

# Render sets PORT; default to 80 if missing.
PORT="${PORT:-80}"
echo "Using PORT=$PORT"

# Configure Apache to listen on the assigned Render port
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Cache configuration and routes for performance (ignore errors if they occur)
php artisan config:cache || true
php artisan route:cache || true

# Run database migrations (optional but common)
php artisan migrate --force || true

# Start Apache in the foreground
exec apache2-foreground
