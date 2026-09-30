import Link from 'next/link'
import { CheckCircle2, Newspaper } from 'lucide-react'
import { loginAction, logoutAction } from '@/app/admin/actions'
import { LoginForm } from '@/components/admin/login-form'
import { getCurrentUser } from '@/lib/cms/auth'

export default async function AdminLoginPage() {
  const user = await getCurrentUser()

  return (
    <div className="admin-theme min-h-[100dvh]">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Newspaper aria-hidden className="size-5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-bold leading-tight">Эхо Алматы</p>
            <p className="text-xs text-muted-foreground">Управление сайтом</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Всё необходимое для работы с новостями
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Создавайте материалы, проверяйте публикации и управляйте сайтом в одном месте.
          </p>
          <ul className="mt-8 space-y-4 text-base">
            {[
              'Понятные разделы без сложных настроек',
              'Черновик можно сохранить в любой момент',
              'Перед публикацией виден текущий статус материала',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  strokeWidth={1.8}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {user ? (
          <section className="admin-panel">
            <h2 className="text-2xl font-bold">Вы уже вошли</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Текущий пользователь: <strong className="text-foreground">{user.name}</strong>
            </p>

            <div className="mt-6 rounded-md bg-secondary p-4">
              <p className="font-semibold">{user.email}</p>
              <p className="mt-1 text-sm text-muted-foreground">Можно продолжить работу.</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/admin"
                className="admin-btn-primary"
              >
                Перейти в админ-панель
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="admin-btn-secondary w-full"
                >
                  Войти под другим аккаунтом
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className="admin-panel">
            <h2 className="text-2xl font-bold">Вход в админ-панель</h2>
            <p className="mt-2 text-base leading-7 text-muted-foreground">
              Введите почту и пароль, которые вам выдал администратор.
            </p>
            <div className="mt-6">
              <LoginForm action={loginAction} />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
