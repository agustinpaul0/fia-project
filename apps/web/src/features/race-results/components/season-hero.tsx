import type { ReactNode } from 'react'

type Props = {
  readonly eyebrow: string
  readonly title: string
  readonly children: ReactNode
}

export const SeasonHero = ({ eyebrow, title, children }: Props): ReactNode => (
  <section className="w-full bg-surface-container-high px-6 py-8 shadow-sm lg:px-8">
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 bg-secondary" />
          <span className="font-bold font-label text-on-surface-variant text-xs uppercase tracking-widest">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-bold font-headline text-4xl text-on-surface uppercase tracking-tight lg:text-6xl">
          {title}
        </h1>
      </div>
      {children}
    </div>
  </section>
)
