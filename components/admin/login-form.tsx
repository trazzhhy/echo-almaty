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
    <form action={formAction} className="space-y-5">
      <div>
        <label className="admin-label" htmlFor="admin-email">
          Электронная почта
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          className="admin-field"
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="admin-password">
          Пароль
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-field"
        />
      </div>
      {state.status === 'error' && (
        <div role="alert" className="rounded-md border border-destructive/25 bg-destructive/5 p-4">
          <p className="font-semibold text-destructive">Не удалось войти</p>
          <p className="mt-1 text-sm text-destructive">{state.message}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="admin-btn-primary w-full"
      >
        {pending ? 'Проверяем данные...' : 'Войти'}
      </button>
    </form>
  )
}
