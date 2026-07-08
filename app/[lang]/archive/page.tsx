import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicPageIntro } from '@/components/public/page-intro'
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
    <PublicSiteShell lang={safeLang} path="/archive">
      <PublicPageIntro
        eyebrow={t(safeLang, 'archive')}
        title={t(safeLang, 'archiveByDate')}
        description={
          safeLang === 'ru'
            ? 'Архив материалов по датам публикации с быстрым переходом к нужному периоду.'
            : 'Жариялану күні бойынша материалдар мұрағаты және қажетті кезеңге жылдам өту мүмкіндігі.'
        }
      />

      <form className="grid gap-4 rounded-[2rem] border border-border bg-card p-5 md:grid-cols-2 xl:grid-cols-4">
        <select
          name="year"
          defaultValue={selectedYear ? String(selectedYear) : ''}
          className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
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
          className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
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
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t(safeLang, 'applyFilters')}
        </button>
        <Link
          href={`/${safeLang}/archive`}
          className="rounded-full border border-border px-5 py-3 text-center text-sm font-semibold transition hover:bg-secondary"
        >
          {t(safeLang, 'clearFilters')}
        </Link>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {t(safeLang, 'foundMaterials')}: {archive.total}
      </p>

      {archive.groups.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
          {t(safeLang, 'noArchive')}
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {archive.groups.map((group) => (
            <section key={group.date} className="rounded-[2rem] border border-border bg-card p-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                {longDate(safeLang, new Date(group.date))}
              </h2>
              <div className="mt-5 space-y-4">
                {group.items.map((article) => (
                  <Link
                    key={article.id}
                    href={`/${safeLang}/article/${article.slug}`}
                    className="flex flex-col gap-3 rounded-3xl border border-border px-5 py-4 transition hover:border-primary md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold">{article.title[safeLang]}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {article.excerpt[safeLang]}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {article.views} {t(safeLang, 'views')}
                    </span>
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
