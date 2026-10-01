// Runs before `prisma migrate deploy` in `pnpm build`. On Vercel it stops the
// build with a readable explanation instead of Prisma's bare P1001 error when
// no reachable database is configured. Local builds are never blocked.

const onVercel = process.env.VERCEL === '1'

// Same lookup order as lib/env.ts (runtime) and prisma.config.ts (migrations).
const runtimeUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
const migrateUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING || runtimeUrl

function isLocalHost(url) {
  try {
    return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(url).hostname)
  } catch {
    return false
  }
}

if (onVercel) {
  const urls = [runtimeUrl, migrateUrl]
  if (urls.some((url) => !url || isLocalHost(url))) {
    // Names only — values contain credentials and must never reach the log.
    const similarVars = Object.keys(process.env)
      .filter((name) => /DATABASE|POSTGRES|PG|NEON|SUPABASE/i.test(name))
      .sort()

    console.error(`
✖ Нет доступной базы данных PostgreSQL.

  ${urls.some(isLocalHost) ? 'DATABASE_URL указывает на localhost — на серверах Vercel такой базы нет.' : 'DATABASE_URL не задан.'}

  Окружение сборки: ${process.env.VERCEL_ENV ?? 'неизвестно'}
  Переменные, похожие на базу данных: ${similarVars.length > 0 ? similarVars.join(', ') : 'нет ни одной'}

  Как исправить:
  1. Vercel → проект → Storage → Create Database → Neon (Postgres) → Connect.
     При подключении отметьте все окружения (Production, Preview, Development)
     и оставьте поле префикса (Custom Prefix) пустым.
  2. Если в Settings → Environment Variables есть DATABASE_URL с localhost — удалите его.
  3. Redeploy. Таблицы создадутся при сборке, данные загрузятся при первом открытии сайта.
`)
    process.exit(1)
  }

  const effects = {
    ADMIN_PANEL_SECRET: 'не будет работать вход в админку',
    CRON_SECRET: 'не будет работать автопубликация по расписанию',
    ANTHROPIC_API_KEY: 'не будет работать автоматический перевод новостей',
  }
  for (const [name, effect] of Object.entries(effects)) {
    if (!process.env[name]?.trim()) {
      console.warn(`⚠ ${name} не задан — сайт соберётся, но ${effect}. Добавьте его в Settings → Environment Variables.`)
    }
  }
}
