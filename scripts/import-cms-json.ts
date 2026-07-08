import path from 'node:path'
import { prisma } from '../lib/prisma'
import { syncCMSData } from '../lib/cms/db-sync'
import { readCMSData } from '../lib/cms/storage'

async function main() {
  const data = await readCMSData()
  await syncCMSData(data)
  console.log(
    `Imported legacy CMS snapshot from ${path.join(process.cwd(), 'data', 'cms.json')} into PostgreSQL.`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
