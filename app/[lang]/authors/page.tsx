import type { Metadata } from 'next'
import { PublicAuthorCard } from '@/components/public/author-card'
import { PublicPageIntro } from '@/components/public/page-intro'
import { PublicSiteShell } from '@/components/public/site-shell'
import { getPublicAuthors } from '@/lib/cms/repository'
import { isLang, t, type Lang } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: safeLang === 'ru' ? 'Авторы Эхо Алматы' : 'Эхо Алматы авторлары',
  }
}

export default async function AuthorsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const authors = await getPublicAuthors()

  return (
    <PublicSiteShell lang={safeLang} path="/authors">
      <PublicPageIntro
        eyebrow={t(safeLang, 'authors')}
        title={t(safeLang, 'authorsDesk')}
        description={
          safeLang === 'ru'
            ? 'Редакторы и журналисты, которые публикуют новости, аналитические материалы и репортажи.'
            : 'Жаңалықтар, талдамалық материалдар мен репортаждар жариялайтын редакторлар мен журналистер.'
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {authors.map((author) => (
          <PublicAuthorCard key={author.id} author={author} lang={safeLang} />
        ))}
      </div>
    </PublicSiteShell>
  )
}
