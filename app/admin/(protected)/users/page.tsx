import { redirect } from 'next/navigation'
import { UserEditorForm } from '@/components/admin/user-editor-form'
import { getCurrentUser } from '@/lib/cms/auth'
import { canManageUsers } from '@/lib/cms/permissions'
import { getUsers } from '@/lib/cms/repository'

export default async function UsersPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  if (!canManageUsers(user)) {
    redirect('/admin')
  }

  const users = await getUsers()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="admin-page-title">Пользователи</h1>
        <p className="admin-page-description">
          Создавайте аккаунты сотрудников и меняйте их права доступа.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Добавить сотрудника</h2>
        <UserEditorForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Сотрудники: {users.length}</h2>
        <div className="divide-y divide-border border-y border-border bg-card">
          {users.map((member) => (
            <details key={member.id} className="group">
              <summary className="cursor-pointer px-5 py-5 marker:text-primary sm:px-6">
                <span className="font-bold">{member.name}</span>
                <span className="ml-3 text-sm text-muted-foreground">{member.email}</span>
              </summary>
              <div className="border-t border-border bg-background p-4 sm:p-6">
                <UserEditorForm user={member} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
