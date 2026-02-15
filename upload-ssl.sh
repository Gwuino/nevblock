#!/bin/bash
# Загрузка сертификатов на сервер и перезапуск nginx.
# Запускать из корня проекта: ./upload-ssl.sh

set -e
SERVER="${1:-root@45.80.130.183}"
REMOTE_DIR="/var/www/nevblock/nginx/ssl"

echo "Загрузка cert.pem и key.pem на $SERVER..."
scp -o StrictHostKeyChecking=no nginx/ssl/cert.pem nginx/ssl/key.pem "$SERVER:$REMOTE_DIR/"

echo "Перезапуск nginx..."
ssh -o StrictHostKeyChecking=no "$SERVER" "cd /var/www/nevblock && docker compose -f docker-compose.prod.yml restart nginx"

echo "Готово. Проверьте: https://nevblock.ru"
