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
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Пользователи
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Роли и доступы</h1>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-bold">Создать пользователя</h2>
        <UserEditorForm />
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-bold">Команда редакции</h2>
        <div className="grid gap-4">
          {users.map((member) => (
            <UserEditorForm key={member.id} user={member} />
          ))}
        </div>
      </section>
    </div>
  )
}
