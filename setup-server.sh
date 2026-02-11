#!/bin/bash
set -e

# Скрипт для первоначальной настройки сервера

SERVER_IP="45.80.130.183"
PROJECT_DIR="/var/www/nevblock"

echo "🔧 Настройка сервера $SERVER_IP"

# Копируем скрипт установки Docker на сервер
echo "📤 Загрузка скрипта установки Docker..."
scp install-docker.sh root@$SERVER_IP:/root/

# Установка Docker на сервере
echo "📦 Установка Docker на сервере..."
ssh root@$SERVER_IP "bash /root/install-docker.sh"

# Создание директории проекта
echo "📁 Создание директории проекта..."
ssh root@$SERVER_IP "mkdir -p $PROJECT_DIR"

# Копирование проекта на сервер
echo "📤 Загрузка проекта на сервер..."
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
    --exclude 'venv' --exclude '__pycache__' --exclude '*.pyc' \
    ./ root@$SERVER_IP:$PROJECT_DIR/

# Копирование скрипта деплоя
echo "📤 Загрузка скрипта деплоя..."
scp deploy.sh root@$SERVER_IP:$PROJECT_DIR/
scp webhook-deploy.sh root@$SERVER_IP:$PROJECT_DIR/

# Установка прав на выполнение
ssh root@$SERVER_IP "chmod +x $PROJECT_DIR/*.sh"

# Создание .env.prod файла для production (если не существует)
echo "📝 Создание .env.prod файла..."
ssh root@$SERVER_IP "if [ ! -f $PROJECT_DIR/.env.prod ]; then
    cat > $PROJECT_DIR/.env.prod << 'EOF'
POSTGRES_PASSWORD=nevblock_prod_password_change_me
DJANGO_SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_HOSTS=localhost,45.80.130.183
DEBUG=0
WEBHOOK_SECRET=$(openssl rand -hex 32)
EOF
    echo '.env.prod создан'
else
    echo '.env.prod уже существует, пропускаем создание'
fi"

# Запуск деплоя
echo "🚀 Запуск деплоя..."
ssh root@$SERVER_IP "cd $PROJECT_DIR && bash deploy.sh"

echo "✅ Настройка сервера завершена!"
echo "🌐 Приложение доступно по адресу: http://$SERVER_IP"
