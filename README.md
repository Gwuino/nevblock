# НЕВБЛОК — сайт ООО «НЕВБЛОК»

Сайт-визитка и каталог продукции (газосиликатные блоки, ФБС, кольца ЖБИ, шлакоблок, полублок, крышки и днища ЖБИ, услуги манипулятора) с админ-панелью для редактирования товаров и цен.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Админ-панель

- Адрес: [http://localhost:3000/admin](http://localhost:3000/admin)
- В разработке по умолчанию: логин `admin`, пароль `admin`

Для продакшена задайте в `.env.local`:

- `ADMIN_USER` — логин (по умолчанию `admin`)
- `ADMIN_PASSWORD_HASH` — хеш пароля (bcrypt). Сгенерировать:  
  `node -e "require('bcryptjs').hash('ВАШ_ПАРОЛЬ', 10).then(h=>console.log(h))"`
- `SESSION_SECRET` — секрет сессии (по желанию)

Скопируйте `.env.example` в `.env.local` и заполните значения.

## Структура

- Публичные страницы: главная, каталог, контакты
- Данные: `data/products.json` (товары), `data/contacts.json` (контакты)
- API: `GET/POST /api/products`, `PUT/DELETE /api/products/[id]`, `POST /api/auth/login`, `POST /api/auth/logout`
