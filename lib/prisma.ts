import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { getDatabaseUrl } from './env'

const globalForPrisma = globalThis as unknown as {
  pool: Pool | undefined
  prisma: PrismaClient | undefined
}

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: getDatabaseUrl(),
  })

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool
  globalForPrisma.prisma = prisma
}
