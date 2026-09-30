'use client'

import { useActionState } from 'react'
import { saveUserAction, type AdminFormState } from '@/app/admin/actions'
import type { AuthUser, Role } from '@/lib/cms/types'

const initialState: AdminFormState = {
  status: 'idle',
}

const roles: Role[] = ['admin', 'editor', 'author', 'moderator']
const roleLabels: Record<Role, string> = {
  admin: 'Администратор - полный доступ',
  editor: 'Редактор - создаёт и публикует',
  author: 'Автор - создаёт черновики',
  moderator: 'Модератор - проверяет материалы',
}

export function UserEditorForm({
  user,
}: {
  user?: AuthUser
}) {
  const [state, formAction, pending] = useActionState(saveUserAction, initialState)

  return (
    <form action={formAction} className="admin-panel space-y-5">
      <input type="hidden" name="id" value={user?.id ?? ''} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-label">Имя</label>
          <input
            name="name"
            required
            defaultValue={user?.name ?? ''}
            className="admin-field"
          />
        </div>
        <div>
          <label className="admin-label">Электронная почта</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={user?.email ?? ''}
            className="admin-field"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-label">Права доступа</label>
          <select
            name="role"
            defaultValue={user?.role ?? 'author'}
            className="admin-field"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">
            Пароль
          </label>
          <input
            name="password"
            type="password"
            className="admin-field"
          />
          <p className="admin-help">
            {user ? 'Оставьте пустым, если пароль менять не нужно.' : 'Придумайте временный пароль для сотрудника.'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-label">Описание на русском</label>
          <textarea
            name="bioRu"
            defaultValue={user?.bio.ru ?? ''}
            rows={3}
            className="admin-textarea"
          />
        </div>
        <div>
          <label className="admin-label">Описание на казахском</label>
          <textarea
            name="bioKk"
            defaultValue={user?.bio.kk ?? ''}
            rows={3}
            className="admin-textarea"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-label">Фотография</label>
          <input
            name="avatar"
            defaultValue={user?.avatar ?? '/placeholder-user.jpg'}
            className="admin-field"
          />
        </div>
        <label className="flex min-h-12 items-center gap-3 rounded-md border border-border px-4 py-3 text-base">
          <input type="checkbox" name="active" defaultChecked={user?.active ?? true} />
          <span>Активный пользователь</span>
        </label>
      </div>

      {state.status === 'error' && (
        <p role="alert" className="text-sm font-medium text-destructive">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="admin-btn-primary"
      >
        {pending ? 'Сохраняем...' : user ? 'Сохранить изменения' : 'Добавить сотрудника'}
      </button>
    </form>
  )
}
