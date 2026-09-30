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
    <div className="mb-8 border-b border-border pb-6">
      {eyebrow ? (
        <p className="mb-2 text-sm text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
