import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'
import { locales, type Lang, type LocalizedText } from '@/lib/i18n'

// Machine translation of article text with Claude. Used by the admin editor
// (button + auto-fill on save) and by scripts/translate-articles.ts. Only
// empty fields are filled: text an editor wrote is never overwritten.

export const translatableFields = ['title', 'excerpt', 'body', 'seoTitle', 'seoDescription'] as const
export type TranslatableField = (typeof translatableFields)[number]
export type ArticleTexts = Record<TranslatableField, LocalizedText>

const MODEL = 'claude-opus-5-5'

const languageNames: Record<Lang, string> = {
  ru: 'Russian',
  kk: 'Kazakh (modern Cyrillic script)',
  en: 'English',
}

const TranslationSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  body: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
})

export class TranslationError extends Error {}

let client: Anthropic | null = null

function getClient() {
  client ??= new Anthropic()
  return client
}

function filled(value?: string) {
  return Boolean(value?.trim())
}

export function isTranslationConfigured() {
  return filled(process.env.ANTHROPIC_API_KEY)
}

/** The language to translate from: the first one with both a title and text. */
export function getSourceLang(texts: ArticleTexts): Lang | null {
  return locales.find((lang) => filled(texts.title[lang]) && filled(texts.body[lang])) ?? null
}

function getMissingFields(texts: ArticleTexts, source: Lang, target: Lang) {
  return translatableFields.filter(
    (field) => filled(texts[field][source]) && !filled(texts[field][target]),
  )
}

/** Languages that have at least one empty field the source language has. */
export function getMissingLangs(texts: ArticleTexts): Lang[] {
  const source = getSourceLang(texts)
  if (!source) return []
  return locales.filter(
    (lang) => lang !== source && getMissingFields(texts, source, lang).length > 0,
  )
}

function buildSystemPrompt(source: Lang, target: Lang) {
  return `You translate articles for Echo Almaty, a news outlet in Kazakhstan that publishes in Russian, Kazakh and English.

Translate the article from ${languageNames[source]} into ${languageNames[target]}. Write it the way a professional journalist working in ${languageNames[target]} would: natural, accurate, and in the same register as the original, not a word-for-word rendering.

Keep every fact, name, number, date and quotation exactly as in the original. Use the established ${languageNames[target]} spelling of Kazakhstani places, institutions and people (for example, Astana, the National Bank of Kazakhstan, Mazhilis). Keep the paragraph breaks (blank lines) of the body. Do not add, remove or comment on anything.

The user message is a JSON object with the article fields: title, excerpt (short description), body (full text), seoTitle and seoDescription. Return the same fields translated. If a field is empty in the original, return an empty string for it.`
}

async function translateTo(texts: ArticleTexts, source: Lang, target: Lang) {
  const original = Object.fromEntries(
    translatableFields.map((field) => [field, texts[field][source].trim()]),
  )

  let response
  try {
    response = await getClient().beta.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      // On a safety decline, the API retries on Anthropic's recommended
      // fallback model inside the same request.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: {
        effort: 'medium',
        format: betaZodOutputFormat(TranslationSchema),
      },
      system: buildSystemPrompt(source, target),
      messages: [{ role: 'user', content: JSON.stringify(original, null, 2) }],
    })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new TranslationError('Anthropic API не принял ключ ANTHROPIC_API_KEY. Проверьте его в настройках Vercel.')
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new TranslationError('Превышен лимит запросов к Anthropic API. Попробуйте через минуту.')
    }
    if (error instanceof Anthropic.APIConnectionError) {
      throw new TranslationError('Не удалось связаться с Anthropic API. Попробуйте ещё раз.')
    }
    if (error instanceof Anthropic.APIError) {
      throw new TranslationError(`Ошибка Anthropic API (${error.status}). Попробуйте ещё раз.`)
    }
    throw error
  }

  if (response.stop_reason === 'refusal') {
    throw new TranslationError('Модель отказалась переводить этот текст. Переведите его вручную.')
  }
  if (response.stop_reason === 'max_tokens') {
    throw new TranslationError('Текст слишком длинный для автоматического перевода. Переведите его вручную.')
  }
  if (!response.parsed_output) {
    throw new TranslationError('Не удалось разобрать ответ переводчика. Попробуйте ещё раз.')
  }

  const translated = response.parsed_output
  return Object.fromEntries(
    getMissingFields(texts, source, target).map((field) => [field, translated[field].trim()]),
  ) as Partial<Record<TranslatableField, string>>
}

/**
 * Translates the source language into every language with empty fields and
 * returns a copy with those fields filled in.
 */
export async function translateMissing<T extends ArticleTexts>(texts: T) {
  if (!isTranslationConfigured()) {
    throw new TranslationError('Автоперевод не настроен: задайте ANTHROPIC_API_KEY в переменных окружения.')
  }

  const source = getSourceLang(texts)
  const langs = getMissingLangs(texts)
  if (!source || langs.length === 0) {
    return { texts, source, langs }
  }

  const results = await Promise.all(langs.map((lang) => translateTo(texts, source, lang)))
  const next = { ...texts }
  for (const field of translatableFields) {
    next[field] = { ...texts[field] }
  }
  langs.forEach((lang, index) => {
    for (const [field, value] of Object.entries(results[index])) {
      next[field as TranslatableField][lang] = value
    }
  })

  return { texts: next, source, langs }
}
