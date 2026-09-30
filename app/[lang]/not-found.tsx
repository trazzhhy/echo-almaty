import Link from 'next/link'

export default function LangNotFound() {
  return (
    <main className="public-theme min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col border border-foreground/20 bg-card sm:min-h-[calc(100vh-5rem)]">
        <header className="flex items-center justify-between border-b border-foreground/20 px-5 py-4 sm:px-8">
          <Link href="/ru" className="font-brand text-xl font-black tracking-[-0.03em]">
            ЭХО АЛМАТЫ
          </Link>
          <span className="text-sm tabular-nums text-muted-foreground">404</span>
        </header>

        <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.38fr)]">
          <section className="flex flex-col justify-end p-5 sm:p-8 lg:p-12">
            <p className="text-sm font-medium text-primary">Страница не найдена</p>
            <h1 className="mt-4 max-w-5xl font-heading text-[clamp(3.25rem,10vw,8rem)] font-bold leading-[0.88] tracking-[-0.04em] text-balance">
              Здесь больше нет новости
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-7 text-muted-foreground">
              Материал мог быть перемещён, скрыт редакцией или адрес был указан неверно.
              <span className="mt-2 block">
                Материал көшірілген, редакция жасырған немесе мекенжай қате көрсетілген болуы мүмкін.
              </span>
            </p>
          </section>

          <aside className="flex flex-col justify-between border-t border-foreground/20 bg-foreground p-5 text-background sm:p-8 lg:border-l lg:border-t-0">
            <span className="font-brand text-[clamp(4rem,10vw,8rem)] font-black leading-none tracking-[-0.04em] text-background/20">
              404
            </span>
            <div className="mt-20 space-y-3">
              <Link
                href="/ru"
                className="flex items-center justify-between border-b border-background/30 py-3 text-sm font-semibold transition-colors hover:border-background"
              >
                Вернуться на главную
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/kk"
                className="flex items-center justify-between border-b border-background/30 py-3 text-sm font-semibold transition-colors hover:border-background"
              >
                Басты бетке оралу
                <span aria-hidden>→</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
