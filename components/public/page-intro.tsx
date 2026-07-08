export function PublicPageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-8 rounded-[2rem] border border-border bg-card px-6 py-7 sm:px-8">
      {eyebrow ? (
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
