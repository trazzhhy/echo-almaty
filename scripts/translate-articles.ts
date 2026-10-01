import { prisma } from '../lib/prisma'
import { getPublishedArticles, saveArticleTranslations } from '../lib/cms/repository'
import {
  getMissingLangs,
  isTranslationConfigured,
  translateMissing,
  TranslationError,
} from '../lib/cms/translation'

// One-time backfill: machine-translates published articles into the
// languages they are missing. Only empty fields are filled.
//
//   pnpm db:translate --dry-run     list what would be translated
//   pnpm db:translate --limit=5     translate at most 5 articles
//   pnpm db:translate               translate everything that is missing
//
// Uses DATABASE_URL and ANTHROPIC_API_KEY from the environment (or .env).

function getLimit() {
  const arg = process.argv.find((item) => item.startsWith('--limit='))
  const value = Number(arg?.split('=')[1])
  return Number.isInteger(value) && value > 0 ? value : Infinity
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const limit = getLimit()

  if (!dryRun && !isTranslationConfigured()) {
    throw new Error('ANTHROPIC_API_KEY is not set.')
  }

  const articles = await getPublishedArticles()
  const pending = articles.filter((article) => getMissingLangs(article).length > 0)
  const batch = pending.slice(0, limit)

  console.log(
    `${articles.length} published, ${pending.length} missing translations` +
      (batch.length < pending.length ? `, processing ${batch.length}` : '') +
      (dryRun ? ' (dry run)' : ''),
  )

  let translated = 0
  let failed = 0
  let skipped = 0

  // One article at a time keeps well inside API rate limits.
  for (const [index, article] of batch.entries()) {
    const label = `[${index + 1}/${batch.length}] ${article.slug} → ${getMissingLangs(article).join(', ')}`

    if (dryRun) {
      console.log(label)
      continue
    }

    try {
      const { texts, langs } = await translateMissing(article)
      const saved = await saveArticleTranslations(article, texts, langs)
      if (saved) {
        translated += 1
        console.log(`${label} ✓`)
      } else {
        skipped += 1
        console.log(`${label} skipped: edited while translating, run again`)
      }
    } catch (error) {
      failed += 1
      const message = error instanceof TranslationError ? error.message : String(error)
      console.error(`${label} ✗ ${message}`)
    }
  }

  if (!dryRun) {
    console.log(`Done: ${translated} translated, ${skipped} skipped, ${failed} failed.`)
  }
  if (failed > 0) {
    process.exitCode = 1
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
