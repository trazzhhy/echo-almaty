import Link from 'next/link'
import { loginAction, logoutAction } from '@/app/admin/actions'
import { LoginForm } from '@/components/admin/login-form'
import { getCurrentUser } from '@/lib/cms/auth'

export default async function AdminLoginPage() {
  const user = await getCurrentUser()

  return (
    <div className="admin-theme flex min-h-screen items-center justify-center px-4 py-12">
      <div className="admin-shell-card grid w-full max-w-5xl gap-8 rounded-[2rem] border border-border p-8 shadow-lg lg:grid-cols-[1fr_420px]">
        <div className="rounded-[1.75rem] bg-primary p-8 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <p className="text-xs uppercase tracking-[0.24em] text-primary-foreground/70">
            Эхо Алматы CMS
          </p>
          <h1 className="mt-4 font-heading text-5xl font-bold leading-tight">
            Редакционная система с ролями, модерацией и планированием
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-primary-foreground/85">
            Внутри уже доступны черновики, публикации, очередь модерации, корзина,
            история изменений, роли пользователей и файловое хранилище материалов.
          </p>
          <div className="mt-8 space-y-2 text-sm text-primary-foreground/80">
            <p>admin@echoalmaty.local / admin123</p>
            <p>editor@echoalmaty.local / editor123</p>
            <p>author@echoalmaty.local / author123</p>
            <p>moderator@echoalmaty.local / moderator123</p>
          </div>
        </div>

        {user ? (
          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Активная сессия
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold">
              Вы уже вошли как {user.name}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Если это не тот аккаунт, сначала выйдите, а затем авторизуйтесь под нужным пользователем.
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-border bg-secondary/60 p-4">
              <p className="font-semibold">{user.email}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Роль: {user.role}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Продолжить в админке
              </Link>
              <form action={logoutAction} className="sm:flex-1">
                <button
                  type="submit"
                  className="h-12 w-full rounded-2xl border border-border bg-background px-5 text-sm font-semibold transition hover:bg-secondary"
                >
                  Выйти и сменить аккаунт
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <h2 className="font-heading text-3xl font-bold">Вход в админ-панель</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Регистрация отключена. Аккаунты создаются только внутри административной части.
            </p>
            <div className="mt-8">
              <LoginForm action={loginAction} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
