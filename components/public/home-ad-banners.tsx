import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  adBannerSlots,
  type HomeAdBanner as HomeAdBannerData,
} from '@/lib/home-ads'
import { imageSrcProps } from '@/lib/article-image'
import { localize, type Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Single full-width leaderboard banner. Renders the configured image when one
 * is set; otherwise shows a styled "ad space available" slot that links to the
 * advertising page, so the layout never shows an empty or broken box.
 */
export function HomeAdBanner({
  lang,
  banner,
  className,
}: {
  lang: Lang
  banner: HomeAdBannerData
  className?: string
}) {
  const href = banner.href.startsWith('http')
    ? banner.href
    : `/${lang}${banner.href.startsWith('/') ? banner.href : `/${banner.href}`}`
  const isExternal = banner.href.startsWith('http')
  const label = localize(banner.label, lang)
  const slotNumber = adBannerSlots.indexOf(banner.slot) + 1

  return (
    <aside
      aria-label={localize(
        {
          ru: `Реклама ${slotNumber}`,
          kk: `Жарнама ${slotNumber}`,
          en: `Advertisement ${slotNumber}`,
        },
        lang,
      )}
      className={cn('w-full', className)}
    >
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
        {localize({ ru: 'Реклама', kk: 'Жарнама', en: 'Advertisement' }, lang)}
      </p>
      <Link
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer sponsored' } : {})}
        className="group relative block overflow-hidden border border-border bg-card transition-colors hover:border-primary/40"
      >
        {banner.imageSrc ? (
          <>
            <div className="relative aspect-[728/90] w-full">
              <Image
                {...imageSrcProps(banner.imageSrc)}
                alt={label}
                fill
                sizes="(min-width: 1280px) 1240px, 100vw"
                className="object-cover"
              />
            </div>
            <span className="sr-only">{label}</span>
          </>
        ) : (
          <AdSlotPlaceholder lang={lang} slotNumber={slotNumber} label={label} />
        )}
      </Link>
    </aside>
  )
}

function AdSlotPlaceholder({
  lang,
  slotNumber,
  label,
}: {
  lang: Lang
  slotNumber: number
  label: string
}) {
  return (
    <div className="relative flex flex-col gap-3 bg-[repeating-linear-gradient(135deg,transparent_0_14px,color-mix(in_oklch,var(--primary)_4%,transparent)_14px_28px)] px-4 py-4 sm:min-h-[110px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />
      <div className="min-w-0">
        <p className="font-heading text-lg font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
          {localize(
            {
              ru: `Рекламное место ${slotNumber}`,
              kk: `Жарнама орны ${slotNumber}`,
              en: `Ad space ${slotNumber}`,
            },
            lang,
          )}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
          {localize(
            {
              ru: 'Баннер на главной странице · 728×90 и адаптивный формат',
              kk: 'Басты беттегі баннер · 728×90 және бейімделген формат',
              en: 'Homepage banner · 728×90 and responsive format',
            },
            lang,
          )}
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 self-start bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity group-hover:opacity-90 sm:self-auto sm:px-4 sm:text-sm">
        {localize({ ru: 'Разместить рекламу', kk: 'Жарнама орналастыру', en: 'Advertise here' }, lang)}
        <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.8} />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  )
}
