#!/bin/bash
set -e

echo "🚀 Starting application..."
echo "DEBUG: DB_USERNAME is [$DB_USERNAME]"
echo "DEBUG: DB_HOST is [$DB_HOST]"

# Fix MPM at runtime
a2dismod mpm_event mpm_worker 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

# Storage symlink
if [ ! -L "/var/www/html/public/storage" ]; then
    rm -rf /var/www/html/public/storage
    ln -s /var/www/html/storage/app/public /var/www/html/public/storage
fi
echo "✅ Storage symlink exists"

# Laravel setup
php artisan config:clear
php artisan migrate --force

# Seed only if no users exist
USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null || echo "0")
if [ "$USER_COUNT" = "0" ]; then
    php artisan db:seed --class=AdminUserSeeder --force
    echo "✅ Admin seeded"
else
    echo "⏭️ Skipping seed"
fi

php artisan cache:clear
php artisan config:cache

# Port setup
export PORT=${PORT:-8080}
sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
sed -i "s/*:80>/*:$PORT>/" /etc/apache2/sites-enabled/*.conf

echo "🎬 Starting Apache on port $PORT..."
exec apache2-foreground