'use client'

import { useActionState } from 'react'
import { type NewsletterState } from '@/app/actions'
import { t, type Lang } from '@/lib/i18n'

const initialState: NewsletterState = {
  status: 'idle',
}

export function NewsletterForm({
  lang,
  action,
}: {
  lang: Lang
  action: (
    state: NewsletterState,
    formData: FormData,
  ) => Promise<NewsletterState>
}) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <section className="border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-bold">{t(lang, 'newsletterTitle')}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t(lang, 'newsletterText')}
          </p>
        </div>

        <form action={formAction} className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder={t(lang, 'emailPlaceholder')}
            className="h-10 min-w-0 flex-1 border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          />
          <button
            type="submit"
            disabled={pending}
            className="h-10 bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? '...' : state.status === 'success' ? t(lang, 'subscriptionDone') : t(lang, 'subscribe')}
          </button>
        </form>
      </div>

      {state.status === 'error' && (
        <p className="mt-3 text-sm text-destructive">{state.message}</p>
      )}
      {state.status === 'success' && (
        <p className="mt-3 text-sm text-muted-foreground">{t(lang, 'newsletterSuccess')}</p>
      )}
    </section>
  )
}
