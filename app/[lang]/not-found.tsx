import Link from 'next/link'

export default function LangNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-5xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">
          Страница не найдена или материал был скрыт редакцией.
        </p>
        <Link
          href="/ru"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
