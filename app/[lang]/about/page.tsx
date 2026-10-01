import type { Metadata } from 'next'
import { PublicPageIntro } from '@/components/public/page-intro'
import { PublicSiteShell } from '@/components/public/site-shell'
import { isLang, localize, t, type Lang } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: t(safeLang, 'aboutTitle'),
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'

  return (
    <PublicSiteShell lang={safeLang} path="/about" mainClassName="max-w-5xl py-8">
      <PublicPageIntro
        eyebrow={t(safeLang, 'aboutTitle')}
        title={t(safeLang, 'brandTitle')}
        description={t(safeLang, 'aboutText')}
      />

      <div className="news-prose-card">
        <p>
          {localize(
            {
              ru: 'Проект Эхо Алматы задуман как современная региональная медиаплатформа: оперативная новостная лента, отдельные тематические разделы, архив и полноценный редакционный workflow для журналистов и редакторов.',
              kk: 'Эхо Алматы жобасы заманауи өңірлік медиаплатформа ретінде ойластырылған: жедел жаңалықтар легі, бөлек тақырыптық бөлімдер, мұрағат және журналистер мен редакторларға арналған толық редакциялық workflow.',
              en: 'Echo Almaty is designed as a modern regional media platform: a fast-moving news feed, dedicated topic sections, an archive, and a complete editorial workflow for journalists and editors.',
            },
            safeLang,
          )}
        </p>
        <p>
          {localize(
            {
              ru: 'Редакция публикует новости, интервью, репортажи и аналитику на русском, казахском и английском языках, а внутренняя админ-панель поддерживает черновики, модерацию, планирование публикаций и историю изменений.',
              kk: 'Редакция жаңалықтар, сұхбаттар, репортаждар мен талдаманы орыс, қазақ және ағылшын тілдерінде жариялайды, ал ішкі админ-панель черновиктерді, модерацияны, жоспарланған жариялауды және өзгерістер тарихын қолдайды.',
              en: 'The newsroom publishes news, interviews, reports and analysis in Russian, Kazakh and English, while the internal admin panel supports drafts, moderation, scheduled publishing and a full change history.',
            },
            safeLang,
          )}
        </p>
        <p>
          {localize(
            {
              ru: 'Ключевой принцип Эхо Алматы — понятная структура сайта и быстрый доступ к материалам по рубрикам, авторам, тегам и датам публикации.',
              kk: 'Эхо Алматы-ның негізгі қағидасы — сайттың түсінікті құрылымы және материалдарға санаттар, авторлар, тегтер мен жариялау күндері арқылы жылдам қолжеткізу.',
              en: 'The key principle of Echo Almaty is a clear site structure and quick access to stories by section, author, tag and publication date.',
            },
            safeLang,
          )}
        </p>
      </div>
    </PublicSiteShell>
  )
}
