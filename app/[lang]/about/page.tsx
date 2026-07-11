import type { Metadata } from 'next'
import { PublicPageIntro } from '@/components/public/page-intro'
import { PublicSiteShell } from '@/components/public/site-shell'
import { isLang, t, type Lang } from '@/lib/i18n'

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
    <PublicSiteShell lang={safeLang} path="/about" mainClassName="mx-auto max-w-5xl px-4 py-8">
      <PublicPageIntro
        eyebrow={t(safeLang, 'aboutTitle')}
        title="Эхо Алматы"
        description={t(safeLang, 'aboutText')}
      />

      <div className="news-prose-card">
        <p>
          {safeLang === 'ru'
            ? 'Проект Эхо Алматы задуман как современная региональная медиаплатформа: оперативная новостная лента, отдельные тематические разделы, архив и полноценный редакционный workflow для журналистов и редакторов.'
            : 'Эхо Алматы жобасы заманауи өңірлік медиаплатформа ретінде ойластырылған: жедел жаңалықтар легі, бөлек тақырыптық бөлімдер, мұрағат және журналистер мен редакторларға арналған толық редакциялық workflow.'}
        </p>
        <p>
          {safeLang === 'ru'
            ? 'Редакция публикует новости, интервью, репортажи и аналитику на русском и казахском языках, а внутренняя админ-панель поддерживает черновики, модерацию, планирование публикаций и историю изменений.'
            : 'Редакция жаңалықтар, сұхбаттар, репортаждар мен талдаманы орыс және қазақ тілдерінде жариялайды, ал ішкі админ-панель черновиктерді, модерацияны, жоспарланған жариялауды және өзгерістер тарихын қолдайды.'}
        </p>
        <p>
          {safeLang === 'ru'
            ? 'Ключевой принцип Эхо Алматы — понятная структура сайта и быстрый доступ к материалам по рубрикам, авторам, тегам и датам публикации.'
            : 'Эхо Алматы-ның негізгі қағидасы — сайттың түсінікті құрылымы және материалдарға санаттар, авторлар, тегтер мен жариялау күндері арқылы жылдам қолжеткізу.'}
        </p>
      </div>
    </PublicSiteShell>
  )
}
