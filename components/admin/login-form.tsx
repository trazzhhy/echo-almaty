'use client'

import { useActionState } from 'react'
import type { AdminFormState } from '@/app/admin/actions'

const initialState: AdminFormState = {
  status: 'idle',
}

export function LoginForm({
  action,
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>
}) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="admin-email">
          E-mail
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="admin-password">
          Пароль
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
        />
      </div>
      {state.status === 'error' && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {pending ? 'Входим...' : 'Войти в админ-панель'}
      </button>
    </form>
  )
}
