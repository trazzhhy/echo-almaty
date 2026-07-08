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
    // where the database URL is injected only at runtime.
    url: process.env.DATABASE_URL ?? '',
  },
})
