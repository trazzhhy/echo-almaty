import type { Lang } from './i18n'

function getLocale(lang: Lang): string {
  return lang === 'ru' ? 'ru-RU' : 'kk-KZ'
}

export function relativeTime(iso: string, lang: Lang): string {
  const now = Date.now()
  const date = new Date(iso).getTime()
  const diff = date - now
  const abs = Math.abs(diff)
  const rtf = new Intl.RelativeTimeFormat(getLocale(lang), { numeric: 'auto' })

  if (abs < 60 * 60 * 1000) {
    return rtf.format(Math.round(diff / (60 * 1000)), 'minute')
  }

  if (abs < 24 * 60 * 60 * 1000) {
    return rtf.format(Math.round(diff / (60 * 60 * 1000)), 'hour')
  }

  return rtf.format(Math.round(diff / (24 * 60 * 60 * 1000)), 'day')
}

export function clockTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(getLocale(lang), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function fullDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(getLocale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function longDate(lang: Lang, value = new Date()): string {
  return new Intl.DateTimeFormat(getLocale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(value)
}

export function monthName(lang: Lang, month: number): string {
  return new Intl.DateTimeFormat(getLocale(lang), {
    month: 'long',
  }).format(new Date(2026, month - 1, 1))
}

export function toDateTimeLocalValue(iso?: string | null): string {
  if (!iso) return ''

  const date = new Date(iso)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60_000)
  return localDate.toISOString().slice(0, 16)
}

export function fromDateTimeLocalValue(value?: string | null): string | null {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}
