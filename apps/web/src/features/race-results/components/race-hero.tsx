import type { RaceSummary } from '@fia/shared/contracts'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { RaceFacts } from './race-facts'
import { RACE_TYPE_LABELS } from './race-type-badge'
import { ResultStatusBadge } from './result-status-badge'

type Props = {
  readonly race: RaceSummary
  readonly hasResults: boolean
}

const BackBar = ({ race }: { readonly race: RaceSummary }): ReactNode => (
  <div className="w-full bg-surface-container-high px-4 py-3 sm:px-8">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      <Link
        to="/results"
        search={{ category: race.categoryCode }}
        className="group inline-flex items-center gap-2 font-label text-on-surface text-xs uppercase tracking-widest transition-colors hover:text-secondary"
      >
        <ArrowLeft
          className="size-3.5 transition-transform group-hover:-translate-x-1"
          aria-hidden
        />
        <span>Volver a resultados</span>
      </Link>
      <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
        Ronda {String(race.round).padStart(2, '0')} / Temporada {race.seasonYear}
      </span>
    </div>
  </div>
)

export const RaceHero = ({ race, hasResults }: Props): ReactNode => (
  <>
    <BackBar race={race} />
    <section className="relative w-full overflow-hidden bg-primary px-4 py-10 text-on-primary sm:px-8 lg:py-14">
      <div className="pointer-events-none absolute -right-8 -bottom-10 hidden select-none opacity-5 md:block">
        <span className="font-black font-headline text-[14rem] leading-none tracking-tighter">
          {race.categoryCode}
        </span>
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-primary-container px-2.5 py-1 font-bold font-label text-[11px] text-on-primary-container uppercase tracking-wider">
            {race.categoryCode}
          </span>
          <span className="bg-surface-container-highest px-2.5 py-1 font-bold font-label text-[11px] text-on-surface uppercase tracking-wider">
            {RACE_TYPE_LABELS[race.type]}
          </span>
          <ResultStatusBadge revision={race.resultsRevision} hasResults={hasResults} />
        </div>
        <div>
          <span className="font-label text-primary-container text-xs uppercase tracking-widest">
            Campeonato FIA {race.seasonYear} · Ronda {String(race.round).padStart(2, '0')}
          </span>
          <h1 className="mt-1 font-bold font-headline text-3xl text-on-primary uppercase tracking-tight sm:text-5xl lg:text-6xl">
            {race.name}
          </h1>
        </div>
        <RaceFacts race={race} hasResults={hasResults} />
      </div>
    </section>
  </>
)
