import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PublicSiteShell } from '@/components/public/site-shell'
import { getArchiveData } from '@/lib/cms/repository'
import { isLang, t, type Lang } from '@/lib/i18n'
import { longDate, monthName } from '@/lib/time'

export const dynamic = 'force-dynamic'

function toNumber(value?: string) {
  const next = Number(value)
  return Number.isFinite(next) && next > 0 ? next : undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: safeLang === 'ru' ? 'Архив Эхо Алматы' : 'Эхо Алматы мұрағаты',
  }
}

export default async function ArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ year?: string; month?: string }>
}) {
  const { lang } = await params
  const { year, month } = await searchParams
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const selectedYear = toNumber(year)
  const selectedMonth = toNumber(month)
  const archive = await getArchiveData({
    year: selectedYear,
    month: selectedMonth,
  })

  return (
    <PublicSiteShell
      lang={safeLang}
      path="/archive"
      mainClassName="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pt-10"
    >
      <header className="border-b border-foreground/20 pb-7">
        <p className="text-sm font-medium text-primary">{t(safeLang, 'archive')}</p>
        <h1 className="mt-2 max-w-4xl font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.035em] text-balance">
          {t(safeLang, 'archiveByDate')}
        </h1>
        <p className="mt-5 max-w-[64ch] text-base leading-7 text-muted-foreground">
          {safeLang === 'ru'
            ? 'Все опубликованные материалы в хронологическом порядке. Выберите год и месяц, чтобы восстановить повестку конкретного периода.'
            : 'Барлық жарияланған материалдар хронологиялық тәртіппен. Белгілі бір кезеңнің күн тәртібін көру үшін жыл мен айды таңдаңыз.'}
        </p>
      </header>

      <form className="news-filter-form mt-8 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto_auto] xl:items-end">
        <select
          name="year"
          defaultValue={selectedYear ? String(selectedYear) : ''}
          aria-label={t(safeLang, 'allYears')}
          className="news-input"
        >
          <option value="">{t(safeLang, 'allYears')}</option>
          {archive.availableYears.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          name="month"
          defaultValue={selectedMonth ? String(selectedMonth) : ''}
          aria-label={t(safeLang, 'allMonths')}
          className="news-input"
        >
          <option value="">{t(safeLang, 'allMonths')}</option>
          {archive.availableMonths.map((item) => (
            <option key={item} value={item}>
              {monthName(safeLang, item)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="news-btn-primary"
        >
          {t(safeLang, 'applyFilters')}
        </button>
        <Link
          href={`/${safeLang}/archive`}
          className="news-btn-secondary text-center"
        >
          {t(safeLang, 'clearFilters')}
        </Link>
      </form>

      <div className="mt-10 flex items-end justify-between gap-5 border-b border-foreground/20 pb-3">
        <h2 className="font-heading text-2xl font-bold tracking-[-0.02em]">
          {safeLang === 'ru' ? 'Хронология' : 'Хронология'}
        </h2>
        <p className="text-sm tabular-nums text-muted-foreground">
          {t(safeLang, 'foundMaterials')}: {archive.total}
        </p>
      </div>

      {archive.groups.length === 0 ? (
        <p className="border-b border-foreground/20 px-6 py-16 text-center text-muted-foreground">
          {t(safeLang, 'noArchive')}
        </p>
      ) : (
        <div>
          {archive.groups.map((group) => (
            <section
              key={group.date}
              className="grid border-b border-foreground/20 py-7 lg:grid-cols-[minmax(190px,0.32fr)_minmax(0,1fr)] lg:gap-10"
            >
              <h3 className="font-heading text-xl font-bold tracking-[-0.02em]">
                {longDate(safeLang, new Date(group.date))}
              </h3>
              <div className="mt-4 divide-y divide-border border-t border-border lg:mt-0">
                {group.items.map((article) => (
                  <Link
                    key={article.id}
                    href={`/${safeLang}/article/${article.slug}`}
                    className="group grid gap-3 py-4 transition-colors hover:text-primary sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-heading text-lg font-semibold leading-snug text-balance">
                        {article.title[safeLang]}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {article.excerpt[safeLang]}
                      </p>
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {article.views} {t(safeLang, 'views')}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="hidden size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                      strokeWidth={1.6}
                    />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PublicSiteShell>
  )
}
