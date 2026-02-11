#!/bin/bash
set -e

echo "🚀 Начало деплоя проекта НЕВБЛОК"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен. Установите Docker сначала.${NC}"
    exit 1
fi

# Определяем команду для docker compose
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}❌ Docker Compose не установлен.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker установлен${NC}"

# Переходим в директорию проекта
cd "$(dirname "$0")"

# Загружаем переменные окружения из .env.prod если существует
if [ -f .env.prod ]; then
    echo -e "${YELLOW}Загрузка переменных окружения из .env.prod...${NC}"
    export $(cat .env.prod | grep -v '^#' | xargs)
fi

# Останавливаем старые контейнеры
echo -e "${YELLOW}Остановка старых контейнеров...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml down 2>/dev/null || true

# Собираем образы
echo -e "${YELLOW}Сборка Docker образов...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml build --no-cache

# Запускаем контейнеры
echo -e "${YELLOW}Запуск контейнеров...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml up -d

# Ждем готовности сервисов
echo -e "${YELLOW}Ожидание готовности сервисов...${NC}"
sleep 10

# Проверяем статус
echo -e "${YELLOW}Проверка статуса контейнеров...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml ps

# Создаем суперпользователя Django (если не существует)
echo -e "${YELLOW}Создание суперпользователя Django...${NC}"
$COMPOSE_CMD -f docker-compose.prod.yml exec -T django python manage.py shell << 'EOF'
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('Суперпользователь создан: admin / admin')
else:
    print('Суперпользователь уже существует')
EOF

echo -e "${GREEN}✅ Деплой завершен успешно!${NC}"
echo -e "${GREEN}🌐 Приложение доступно по адресу: http://45.80.130.183${NC}"
echo -e "${GREEN}🔐 Django Admin: http://45.80.130.183/admin (admin / admin)${NC}"
