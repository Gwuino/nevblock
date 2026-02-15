# Сертификат HTTPS

Чтобы включить HTTPS для nevblock.ru:

1. **Скачайте файлы сертификата** в панели, где выпущен сертификат (Let's Encrypt):
   - **Сертификат** (полная цепочка) — сохраните как `cert.pem`
   - **Приватный ключ** — сохраните как `key.pem`

2. **Положите файлы на сервер** в эту папку (на сервере путь: `/var/www/nevblock/nginx/ssl/`):
   - `cert.pem` — сертификат
   - `key.pem` — закрытый ключ

   Например с локального компьютера:
   ```bash
   scp cert.pem root@45.80.130.183:/var/www/nevblock/nginx/ssl/cert.pem
   scp key.pem root@45.80.130.183:/var/www/nevblock/nginx/ssl/key.pem
   ```

3. **Перезапустите nginx** на сервере:
   ```bash
   cd /var/www/nevblock && docker compose -f docker-compose.prod.yml restart nginx
   ```

4. В **.env.prod** на сервере задайте:
   ```
   PUBLIC_BASE_URL=https://nevblock.ru
   ```
   и перезапустите контейнер django:
   ```bash
   docker compose -f docker-compose.prod.yml up -d django
   ```

После этого сайт будет доступен по **https://nevblock.ru**. Порт 443 уже открыт в конфиге nginx.
