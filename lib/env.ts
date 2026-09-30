const LOCAL_SITE_URL = 'http://localhost:3000'
const LOCAL_ADMIN_PANEL_SECRET = 'echo-almaty-admin-dev-secret'

function readEnv(name: string) {
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

export function isProduction() {
  return process.env.NODE_ENV === 'production'
}

export function getOptionalEnv(name: string) {
  return readEnv(name)
}

export function getRequiredEnv(name: string) {
  const value = readEnv(name)
  if (!value) {
    throw new Error(`${name} is required.`)
  }

  return value
}

export function getSiteUrl() {
  const value = readEnv('NEXT_PUBLIC_SITE_URL')
  if (value) {
    return value
  }

  if (!isProduction()) {
    return LOCAL_SITE_URL
  }

  // On Vercel, default to the project's production domain (or this
  // deployment's URL) so a deploy works before NEXT_PUBLIC_SITE_URL is set.
  const vercelHost = readEnv('VERCEL_PROJECT_PRODUCTION_URL') ?? readEnv('VERCEL_URL')
  if (vercelHost) {
    return `https://${vercelHost}`
  }

  throw new Error('NEXT_PUBLIC_SITE_URL is required in production.')
}

/**
 * Postgres connection string for the app at runtime. Besides DATABASE_URL,
 * accepts POSTGRES_URL, which the Vercel Postgres integrations (Neon,
 * Supabase) inject automatically.
 */
export function getDatabaseUrl() {
  return readEnv('DATABASE_URL') ?? readEnv('POSTGRES_URL')
}

export function getAdminPanelSecret() {
  const value = readEnv('ADMIN_PANEL_SECRET')
  if (value) {
    return value
  }

  if (!isProduction()) {
    return LOCAL_ADMIN_PANEL_SECRET
  }

  throw new Error('ADMIN_PANEL_SECRET is required in production.')
}
