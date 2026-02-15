# Инструкция по деплою проекта НЕВБЛОК

## Быстрый старт

### 1. Первоначальная установка на сервере

Выполните на локальной машине:

```bash
bash setup-server.sh
```

Этот скрипт:
- Установит Docker и Docker Compose на сервер
- Загрузит проект на сервер
- Запустит приложение

### Админка (скрытый путь)

- **Управление товарами (Next.js):** `https://ваш-домен/manage` и `/manage/login`
- **Django Admin (полная админка БД):** `https://ваш-домен/manage/backend/`  
  Путь намеренно нестандартный; ссылка на него нигде на сайте не публикуется.

### 2. Ручной деплой

Для ручного деплоя выполните на сервере:

```bash
cd /var/www/nevblock
bash deploy.sh
```

### 3. Настройка автоматического деплоя через Git Webhook

#### Вариант A: GitHub Webhook

1. Перейдите в настройки вашего репозитория на GitHub
2. Settings → Webhooks → Add webhook
3. Укажите:
   - **Payload URL**: `http://45.80.130.183/webhook`
   - **Content type**: `application/json`
   - **Secret**: сгенерируйте секретный ключ (например, `openssl rand -hex 32`)
   - **Events**: выберите "Just the push event"
   - **Active**: включите

4. На сервере создайте файл `.env.prod`:

```bash
cd /var/www/nevblock
cat > .env.prod << EOF
POSTGRES_PASSWORD=your_secure_password
DJANGO_SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_HOSTS=localhost,45.80.130.183
DEBUG=0
WEBHOOK_SECRET=your_webhook_secret_from_github
EOF
```

5. Обновите `docker-compose.prod.yml` для использования `.env.prod`:

```bash
# В docker-compose.prod.yml замените все ${VAR} на чтение из .env.prod
# Или используйте: env_file: .env.prod
```

6. Перезапустите контейнеры:

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

#### Вариант B: GitLab Webhook

Аналогично GitHub, но используйте:
- **URL**: `http://45.80.130.183/webhook`
- **Secret Token**: укажите в `.env.prod` как `WEBHOOK_SECRET`

#### Вариант C: Ручной триггер

Можно вручную вызвать webhook:

```bash
curl -X POST http://45.80.130.183/webhook
```

## Структура проекта на сервере

```
/var/www/nevblock/
├── backend/          # Django приложение
├── app/              # Next.js приложение
├── nginx/            # Конфигурация Nginx
├── data/             # Данные (products.json и т.д.)
├── deploy.sh         # Скрипт ручного деплоя
├── webhook-deploy.sh # Скрипт автоматического деплоя
├── docker-compose.prod.yml
└── .env.prod         # Переменные окружения (создать вручную)
```

## Доступ к приложению

- **Основной сайт**: http://45.80.130.183
- **Управление товарами**: http://45.80.130.183/manage (логин как в API)
- **Django Admin**: http://45.80.130.183/manage/backend/
  - Логин: `admin`
  - Пароль: `admin` (изменить после первого входа!)

## Место на диске и нормальный деплой

Для **автоматической сборки** образа Next.js на сервере (вебхук или `docker compose build app`) нужно **не менее ~2 ГБ свободного места** (лучше 10 ГБ). Если диск маленький:
- Либо увеличьте диск VPS и при необходимости расширьте раздел: `resize2fs /dev/sda1` (после расширения тома в панели хостинга).
- Либо деплойте фронт вручную: соберите образ локально (`npm run build`, затем `docker build -f Dockerfile.prebuilt --platform linux/amd64 -t nevblock-app . build-context-prebuilt`), сохраните в файл, загрузите на сервер и выполните `docker load` и `docker compose up -d app`.

## Обновление проекта

### Через Git (рекомендуется)

1. На сервере:

```bash
cd /var/www/nevblock
git pull origin main  # или master
bash deploy.sh
```

### Через webhook (автоматически)

Просто сделайте `git push` в репозиторий - деплой запустится автоматически.

## Полезные команды

### Просмотр логов

```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f django
docker-compose -f docker-compose.prod.yml logs -f webhook
```

### Перезапуск сервисов

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Остановка всех сервисов

```bash
docker-compose -f docker-compose.prod.yml down
```

### Создание суперпользователя Django

```bash
docker-compose -f docker-compose.prod.yml exec django python manage.py createsuperuser
```

### Загрузка каталога из data/products.json

Каталог хранится в БД; при перезапуске данные **не** перезатираются. Чтобы один раз загрузить или сбросить каталог из файла `data/products.json` (например, после первой установки):

```bash
docker-compose -f docker-compose.prod.yml exec django python manage.py import_data --clear
```

## Безопасность

⚠️ **Важно:**

1. Измените пароль суперпользователя Django после первого входа
2. Используйте сильные пароли для PostgreSQL (`POSTGRES_PASSWORD`)
3. Сгенерируйте уникальный `DJANGO_SECRET_KEY`
4. Настройте `WEBHOOK_SECRET` для защиты webhook endpoint
5. После настройки SSL, включите HTTPS в `nginx/nginx.conf`
6. Ограничьте доступ к портам 8000 и 3000 через firewall (они доступны только через Nginx)

## Настройка SSL (опционально)

1. Установите certbot:

```bash
apt-get install certbot python3-certbot-nginx
```

2. Получите сертификат:

```bash
certbot --nginx -d yourdomain.com
```

3. Раскомментируйте HTTPS секцию в `nginx/nginx.conf`
4. Перезапустите Nginx:

```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

## Устранение неполадок

### Контейнеры не запускаются

```bash
# Проверьте логи
docker-compose -f docker-compose.prod.yml logs

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps
```

### Проблемы с базой данных

```bash
# Проверьте подключение к БД
docker-compose -f docker-compose.prod.yml exec db psql -U nevblock -d nevblock

# Примените миграции вручную
docker-compose -f docker-compose.prod.yml exec django python manage.py migrate
```

### Webhook не работает

```bash
# Проверьте логи webhook сервера
docker-compose -f docker-compose.prod.yml logs webhook

# Проверьте доступность endpoint
curl http://localhost:9000
```
