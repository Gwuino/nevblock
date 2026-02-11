#!/bin/bash
set -e

# Скрипт для автоматического деплоя при получении webhook от Git

PROJECT_DIR="${PROJECT_DIR:-/var/www/nevblock}"
LOG_FILE="${LOG_FILE:-/var/log/nevblock-deploy.log}"

# Создаем директорию для логов если не существует
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Начало автоматического деплоя"

cd "$PROJECT_DIR" || {
    log "❌ Ошибка: директория $PROJECT_DIR не найдена"
    exit 1
}

# Загружаем переменные окружения из .env.prod если существует
if [ -f .env.prod ]; then
    log "📝 Загрузка переменных окружения из .env.prod..."
    export $(cat .env.prod | grep -v '^#' | xargs)
fi

# Обновление кода из Git (если используется Git)
if [ -d ".git" ]; then
    log "📥 Обновление кода из Git..."
    git config --global --add safe.directory "$PROJECT_DIR" 2>/dev/null || true
    git fetch origin 2>&1 | tee -a "$LOG_FILE"
    # Сброс локальных изменений, чтобы pull не падал; .env.prod не в git — не затрётся
    git reset --hard origin/main 2>&1 | tee -a "$LOG_FILE" || git reset --hard origin/master 2>&1 | tee -a "$LOG_FILE"
fi

# Пересборка и перезапуск контейнеров
# Освобождаем место под сборку (кэш сборки)
docker builder prune -f 2>&1 | tee -a "$LOG_FILE" || true

log "🔨 Пересборка Docker образов..."

# Используем docker compose (новый синтаксис) или docker-compose (старый)
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    log "❌ Docker Compose не найден"
    exit 1
fi

$COMPOSE_CMD -f docker-compose.prod.yml build --no-cache 2>&1 | tee -a "$LOG_FILE"

log "🔄 Перезапуск контейнеров..."
$COMPOSE_CMD -f docker-compose.prod.yml down 2>&1 | tee -a "$LOG_FILE"
$COMPOSE_CMD -f docker-compose.prod.yml up -d 2>&1 | tee -a "$LOG_FILE"

# Ожидание готовности
sleep 10

# Проверка статуса
if $COMPOSE_CMD -f docker-compose.prod.yml ps | grep -q "Up"; then
    log "✅ Деплой завершен успешно!"
    exit 0
else
    log "❌ Ошибка: контейнеры не запустились"
    $COMPOSE_CMD -f docker-compose.prod.yml ps | tee -a "$LOG_FILE"
    exit 1
fi
