# Быстрый старт - Деплой на сервер

## Шаг 1: Запуск автоматической установки

Выполните на вашей локальной машине:

```bash
bash setup-server.sh
```

Этот скрипт автоматически:
- ✅ Установит Docker и Docker Compose на сервер
- ✅ Загрузит весь проект на сервер
- ✅ Создаст файл с переменными окружения (.env.prod)
- ✅ Запустит приложение

## Шаг 2: Проверка работы

После завершения установки откройте в браузере:
- **Сайт**: http://45.80.130.183
- **Админ панель**: http://45.80.130.183/admin
  - Логин: `admin`
  - Пароль: `admin` (⚠️ измените после первого входа!)

## Шаг 3: Настройка автоматического деплоя через Git

### Если используете GitHub:

1. Перейдите в настройки репозитория: Settings → Webhooks → Add webhook
2. Заполните:
   - **Payload URL**: `http://45.80.130.183/webhook`
   - **Content type**: `application/json`
   - **Secret**: скопируйте значение `WEBHOOK_SECRET` из файла `.env.prod` на сервере
   - **Events**: выберите "Just the push event"
3. Сохраните

Теперь при каждом `git push` в репозиторий приложение автоматически обновится!

### Если используете GitLab:

Аналогично GitHub, но используйте:
- **URL**: `http://45.80.130.183/webhook`
- **Secret Token**: значение `WEBHOOK_SECRET` из `.env.prod`

## Ручное обновление

Если нужно обновить вручную, подключитесь к серверу:

```bash
ssh root@45.80.130.183
cd /var/www/nevblock
git pull  # если используете Git
bash deploy.sh
```

## Полезные команды

### Просмотр логов
```bash
ssh root@45.80.130.183
cd /var/www/nevblock
docker compose -f docker-compose.prod.yml logs -f
```

### Перезапуск
```bash
ssh root@45.80.130.183
cd /var/www/nevblock
docker compose -f docker-compose.prod.yml restart
```

### Остановка
```bash
ssh root@45.80.130.183
cd /var/www/nevblock
docker compose -f docker-compose.prod.yml down
```

## Безопасность

⚠️ **Обязательно после первого запуска:**

1. Измените пароль админа Django в админ-панели
2. Измените `POSTGRES_PASSWORD` в `.env.prod` на сервере
3. Сгенерируйте новый `DJANGO_SECRET_KEY`:
   ```bash
   openssl rand -hex 32
   ```
4. Обновите `WEBHOOK_SECRET` для защиты webhook endpoint

Подробная документация: см. [DEPLOY.md](./DEPLOY.md)
