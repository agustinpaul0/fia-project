import type { ReactNode } from 'react'

type Props = {
  readonly total: number | null
  readonly season: number
}

export const CategoriesHero = ({ total, season }: Props): ReactNode => (
  <>
    <div className="flex w-full items-center gap-3 border-outline border-b-2 bg-primary px-6 py-2 font-label text-primary-container text-xs uppercase tracking-widest lg:px-12">
      <span className="inline-block h-2 w-2 animate-pulse bg-secondary" />
      <span>Temporada {season} en curso — Resultados oficiales FIA disponibles</span>
    </div>
    <section className="flex w-full flex-col justify-between gap-6 border-outline border-b-2 bg-surface px-6 pt-10 pb-8 md:flex-row md:items-end lg:px-12">
      <div className="max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="bg-primary px-2 py-0.5 font-bold font-label text-primary-container text-xs uppercase tracking-widest">
            Registro oficial
          </span>
          <span className="font-mono text-on-surface-variant text-xs tracking-wider">
            DOC. REF / FIA-CAT-{season}
          </span>
        </div>
        <h1 className="font-bold font-headline text-5xl text-on-surface uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
          Categorías
        </h1>
        <p className="mt-3 max-w-2xl font-body text-base text-on-surface-variant leading-relaxed sm:text-lg">
          Campeonatos bajo supervisión oficial de la FIA. Elegí una categoría para ver su campeonato
          de pilotos y el calendario de carreras de los últimos años.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
        <div className="flex flex-col border-2 border-outline bg-surface-container px-4 py-2">
          <span className="font-bold font-label text-[10px] text-on-surface-variant uppercase">
            Total categorías
          </span>
          <span className="font-bold font-headline text-2xl text-on-surface leading-tight">
            {total === null ? '—' : `${total} activas`}
          </span>
        </div>
        <div className="flex flex-col border-2 border-outline bg-primary-container px-4 py-2 shadow-[3px_3px_0px_#1a1a1a]">
          <span className="font-bold font-label text-[10px] text-primary uppercase">Temporada</span>
          <span className="font-bold font-headline text-2xl text-primary leading-tight">
            {season}
          </span>
        </div>
      </div>
    </section>
  </>
)
