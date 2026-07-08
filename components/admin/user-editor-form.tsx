'use client'

import { useActionState } from 'react'
import { saveUserAction, type AdminFormState } from '@/app/admin/actions'
import type { AuthUser, Role } from '@/lib/cms/types'

const initialState: AdminFormState = {
  status: 'idle',
}

const roles: Role[] = ['admin', 'editor', 'author', 'moderator']

export function UserEditorForm({
  user,
}: {
  user?: AuthUser
}) {
  const [state, formAction, pending] = useActionState(saveUserAction, initialState)

  return (
    <form action={formAction} className="space-y-4 rounded-[1.5rem] border border-border bg-card p-5">
      <input type="hidden" name="id" value={user?.id ?? ''} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Имя</label>
          <input
            name="name"
            required
            defaultValue={user?.name ?? ''}
            className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">E-mail</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={user?.email ?? ''}
            className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Роль</label>
          <select
            name="role"
            defaultValue={user?.role ?? 'author'}
            className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Пароль {user ? '(заполните только для смены)' : ''}
          </label>
          <input
            name="password"
            type="password"
            className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Био RU</label>
          <textarea
            name="bioRu"
            defaultValue={user?.bio.ru ?? ''}
            rows={3}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Био KK</label>
          <textarea
            name="bioKk"
            defaultValue={user?.bio.kk ?? ''}
            rows={3}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Аватар</label>
          <input
            name="avatar"
            defaultValue={user?.avatar ?? '/placeholder-user.jpg'}
            className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
          <input type="checkbox" name="active" defaultChecked={user?.active ?? true} />
          <span>Активный пользователь</span>
        </label>
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {pending ? 'Сохраняем...' : user ? 'Обновить пользователя' : 'Создать пользователя'}
      </button>
    </form>
  )
}
