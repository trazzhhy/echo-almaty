import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Use process.env directly so `prisma generate` can run in environments
    // where the database URL is injected only at runtime. Migrations prefer
    // the direct (non-pooled) connection that Vercel's Neon/Supabase
    // integrations provide, since poolers can break migration locks.
    url:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      '',
  },
})
