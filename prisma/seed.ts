import { prisma } from '../lib/prisma'
import { syncCMSData } from '../lib/cms/db-sync'
import { readCMSData } from '../lib/cms/storage'

async function main() {
  const usersCount = await prisma.user.count()
  if (usersCount > 0) {
    console.log('Database already contains data, skipping seed.')
    return
  }

  const data = await readCMSData()
  await syncCMSData(data)
  console.log('Seeded PostgreSQL database from the current CMS snapshot.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
