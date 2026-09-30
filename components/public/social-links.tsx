import type { ReactNode } from 'react'
import { localize, type Lang } from '@/lib/i18n'
import {
  getSocialItems,
  socialLabels,
  type SocialItem,
  type SocialNetwork,
} from '@/lib/social-links'
import { cn } from '@/lib/utils'

const icons: Record<SocialNetwork, ReactNode> = {
  tiktok: (
    <path
      fill="currentColor"
      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </g>
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
    />
  ),
}

function SocialIcon({ network, className }: { network: SocialNetwork; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-[18px] shrink-0', className)}>
      {icons[network]}
    </svg>
  )
}

/** Link when the URL is configured, muted non-interactive item otherwise. */
function SocialItemLink({
  item,
  lang,
  className,
  children,
}: {
  item: SocialItem
  lang: Lang
  className: string
  children: ReactNode
}) {
  if (!item.url) {
    return (
      <span
        aria-disabled="true"
        title={`${item.name} — ${localize(socialLabels.soon, lang)}`}
        className={cn(className, 'cursor-default opacity-45')}
      >
        {children}
      </span>
    )
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      title={item.name}
      className={cn(className, 'transition-colors duration-200 hover:border-primary/50 hover:text-primary')}
    >
      {children}
    </a>
  )
}

/**
 * Fixed vertical rail at the left edge. Only shown from 1440px wide, where the
 * page gutter is wider than the rail, so it never overlaps content.
 */
export function SocialRail({ lang }: { lang: Lang }) {
  const items = getSocialItems()
  if (items.length === 0) return null

  return (
    <nav
      aria-label={localize(socialLabels.title, lang)}
      className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-1 border border-foreground/15 bg-card/95 p-1 shadow-sm backdrop-blur min-[1440px]:flex"
    >
      {items.map((item) => (
        <SocialItemLink
          key={item.network}
          item={item}
          lang={lang}
          className="flex size-10 items-center justify-center text-foreground"
        >
          <SocialIcon network={item.network} />
          <span className="sr-only">{item.name}</span>
        </SocialItemLink>
      ))}
    </nav>
  )
}

/** Sidebar card — the in-flow variant for tablets, laptops and phones. */
export function SocialCard({ lang, className }: { lang: Lang; className?: string }) {
  const items = getSocialItems()
  if (items.length === 0) return null

  return (
    <section
      aria-label={localize(socialLabels.title, lang)}
      className={cn('border border-border bg-card p-4 sm:p-5', className)}
    >
      <h2 className="font-heading text-lg font-bold tracking-tight">
        {localize(socialLabels.title, lang)}
      </h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {localize(socialLabels.text, lang)}
      </p>
      <ul className="mt-4 grid grid-cols-3 gap-2">
        {items.map((item) => (
          <li key={item.network}>
            <SocialItemLink
              item={item}
              lang={lang}
              className="flex min-h-16 flex-col items-center justify-center gap-1.5 border border-border px-1 py-2.5 text-center text-foreground"
            >
              <SocialIcon network={item.network} className="size-5" />
              <span className="text-[11px] font-medium leading-none">{item.name}</span>
              {!item.url ? (
                <span className="text-[10px] leading-none text-muted-foreground">
                  {localize(socialLabels.soon, lang)}
                </span>
              ) : null}
            </SocialItemLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Compact icon row (footer). */
export function SocialInline({ lang, className }: { lang: Lang; className?: string }) {
  const items = getSocialItems()
  if (items.length === 0) return null

  return (
    <ul aria-label={localize(socialLabels.title, lang)} className={cn('flex gap-2', className)}>
      {items.map((item) => (
        <li key={item.network}>
          <SocialItemLink
            item={item}
            lang={lang}
            className="flex size-10 items-center justify-center border border-border bg-card text-foreground"
          >
            <SocialIcon network={item.network} />
            <span className="sr-only">{item.name}</span>
          </SocialItemLink>
        </li>
      ))}
    </ul>
  )
}
