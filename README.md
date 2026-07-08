# Эхо Алматы

Двуязычная новостная платформа и редакционная CMS на `Next.js 16`, `React 19`, `Prisma` и `PostgreSQL`.

Проект включает:
- публичный сайт на русском и казахском языках;
- ленту новостей, категории, архив, авторов, поиск и рекомендованные материалы;
- административную панель без публичной регистрации;
- роли `admin`, `editor`, `author`, `moderator`;
- черновики, модерацию, отложенную публикацию, мягкое удаление и журнал изменений;
- хранение данных в `PostgreSQL`;
- загрузку изображений в `local` или `S3-compatible` storage;
- трекинг просмотров и блоки "Популярное за 24 часа / неделю";
- cron endpoint для автоматической публикации запланированных материалов.

## Стек

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Prisma`
- `PostgreSQL`
- `Tailwind CSS 4`
- `AWS SDK S3` для совместимых object storage

## Основные возможности

### Публичная часть

- Главная страница с главной новостью дня
- Лента новостей с фильтрами и сортировкой
- Страницы категорий
- Страница автора
- Архив по датам
- Поиск по заголовку, анонсу, тексту, тегам, авторам и источникам
- Популярные новости
- Рекомендуемые новости
- SEO metadata, `robots.txt`, `sitemap.xml`

### Админ-панель

- Вход только по заранее созданным аккаунтам
- Создание и редактирование новостей
- Черновики
- Отправка на модерацию
- Одобрение и публикация
- Отложенная публикация
- Корзина и восстановление
- Скрытие новости с главной
- Управление пользователями
- История действий

## Быстрый старт локально

### 1. Установить зависимости

```bash
pnpm install
```

### 2. Подготовить переменные окружения

Скопируй пример:

```bash
cp .env.example .env
```

Минимально для локальной разработки достаточно:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/echo_almaty?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_PANEL_SECRET="echo-almaty-local-admin-secret"
CRON_SECRET="echo-almaty-local-cron-secret"
STORAGE_DRIVER="local"
```

### 3. Поднять PostgreSQL

```bash
pnpm db:up
```

### 4. Применить миграции

```bash
pnpm db:migrate
```

### 5. Заполнить базу

Есть 2 варианта:

1. Импортировать редакционные данные из JSON:

```bash
pnpm db:import-json
```

2. Или использовать seed:

```bash
pnpm db:seed
```

### 6. Запустить проект

```bash
pnpm dev
```

Сайт будет доступен на [http://localhost:3000](http://localhost:3000).

## Полезные команды

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma:generate
pnpm db:migrate
pnpm db:seed
pnpm db:import-json
pnpm db:studio
pnpm db:up
pnpm db:down
```

## Демо-аккаунты

Если база заполнена seed-данными или импортом проекта, доступны тестовые аккаунты:

- `admin@echoalmaty.local / admin123`
- `editor@echoalmaty.local / editor123`
- `author@echoalmaty.local / author123`
- `moderator@echoalmaty.local / moderator123`

Перед продакшеном пароли обязательно нужно сменить.

## Переменные окружения

### Обязательные

- `DATABASE_URL` — строка подключения к PostgreSQL
- `NEXT_PUBLIC_SITE_URL` — публичный URL сайта
- `ADMIN_PANEL_SECRET` — секрет подписи admin session cookie
- `CRON_SECRET` — секрет для защищенного cron endpoint

### Для хранения файлов

- `STORAGE_DRIVER` — `local` или `s3`

Если `STORAGE_DRIVER="s3"`, дополнительно нужны:

- `STORAGE_PUBLIC_BASE_URL`
- `STORAGE_S3_REGION`
- `STORAGE_S3_BUCKET`
- `STORAGE_S3_ENDPOINT`
- `STORAGE_S3_ACCESS_KEY_ID`
- `STORAGE_S3_SECRET_ACCESS_KEY`
- `STORAGE_S3_FORCE_PATH_STYLE`
- `STORAGE_S3_PREFIX`

## Деплой

Проект можно размещать на любом Node.js-хостинге, где поддерживаются:

- `Node.js 20+`
- `PostgreSQL`
- переменные окружения
- планировщик задач или внешний cron
- желательно `S3-compatible` object storage

### Что нужно подготовить перед деплоем

1. Создать PostgreSQL базу
2. Настроить все env-переменные
3. Для production выбрать `STORAGE_DRIVER="s3"`
4. Подключить bucket для изображений
5. Настроить scheduler для автопубликации

### Рекомендуемая схема деплоя

#### Build command

```bash
pnpm install --frozen-lockfile && pnpm build
```

#### Start command

```bash
pnpm start
```

### Обязательные действия после первого деплоя

Применить миграции:

```bash
pnpm db:migrate
```

Затем заполнить базу:

```bash
pnpm db:import-json
```

или:

```bash
pnpm db:seed
```

## Автопубликация запланированных материалов

Для автоматического выхода новостей используется endpoint:

```text
/api/cron/publish-scheduled
```

Запрос должен содержать один из заголовков:

```text
Authorization: Bearer <CRON_SECRET>
```

или:

```text
x-cron-secret: <CRON_SECRET>
```

Рекомендуется вызывать этот endpoint каждую минуту или каждые 5 минут через scheduler хостинга.

## Хранение файлов

### Локальный режим

```env
STORAGE_DRIVER="local"
```

Подходит только для локальной разработки.

### Production режим

```env
STORAGE_DRIVER="s3"
```

Подходит для:

- AWS S3
- Cloudflare R2
- MinIO
- DigitalOcean Spaces
- других S3-compatible storage

## Пример production env

```env
DATABASE_URL="postgresql://user:password@host:5432/echo_almaty?schema=public"
NEXT_PUBLIC_SITE_URL="https://example.com"
ADMIN_PANEL_SECRET="long-random-secret"
CRON_SECRET="second-long-random-secret"
STORAGE_DRIVER="s3"
STORAGE_PUBLIC_BASE_URL="https://cdn.example.com"
STORAGE_S3_REGION="auto"
STORAGE_S3_BUCKET="echo-almaty"
STORAGE_S3_ENDPOINT="https://your-endpoint.example.com"
STORAGE_S3_ACCESS_KEY_ID="your-key"
STORAGE_S3_SECRET_ACCESS_KEY="your-secret"
STORAGE_S3_FORCE_PATH_STYLE="false"
STORAGE_S3_PREFIX="uploads"
```

## Проверка перед запуском в production

Перед публикацией желательно выполнить:

```bash
pnpm lint
pnpm build
```

## Примечания

- Регистрация в админ-панели отключена
- Аккаунты создаются только из административной части
- При первом запуске проект умеет автоматически подхватить данные из `data/cms.json`, если база пуста
- Просмотры новостей сохраняются в базе данных
- Блок "Популярное" строится по реальным просмотрам
