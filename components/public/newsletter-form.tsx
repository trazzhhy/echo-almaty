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
    <section className="overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold">
            {t(lang, 'newsletterTitle')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
            {t(lang, 'newsletterText')}
          </p>
        </div>

        <form action={formAction} className="flex w-full flex-col gap-3 sm:max-w-lg sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder={t(lang, 'emailPlaceholder')}
            className="h-12 min-w-0 flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="h-12 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? '...' : state.status === 'success' ? t(lang, 'subscriptionDone') : t(lang, 'subscribe')}
          </button>
        </form>
      </div>

      {state.status === 'error' && (
        <p className="mt-4 text-sm text-primary-foreground/90">{state.message}</p>
      )}
      {state.status === 'success' && (
        <p className="mt-4 text-sm text-primary-foreground/90">
          {t(lang, 'newsletterSuccess')}
        </p>
      )}
    </section>
  )
}
