import type { RaceSummary } from '@fia/shared/contracts'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Trophy } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatNumericDate } from '@/lib/format-date-time'
import { RaceTypeBadge } from './race-type-badge'

export type RaceLinkTarget = 'public' | 'admin'

type Props = {
  readonly races: readonly RaceSummary[]
  readonly target: RaceLinkTarget
}

type LinkProps = {
  readonly race: RaceSummary
  readonly target: RaceLinkTarget
  readonly className: string
  readonly children: ReactNode
}

const RaceLink = ({ race, target, className, children }: LinkProps): ReactNode => {
  const params = { raceId: race.id }
  return target === 'admin' ? (
    <Link to="/admin/results/$raceId" params={params} className={className}>
      {children}
    </Link>
  ) : (
    <Link to="/races/$raceId" params={params} className={className}>
      {children}
    </Link>
  )
}

const Winner = ({ name }: { readonly name: string | null }): ReactNode => (
  <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
    <Trophy className="size-3 fill-primary-container text-primary-container" aria-hidden />
    <span className="font-medium text-on-surface">{name ?? 'Sin resultados'}</span>
  </div>
)

const RaceCard = ({ race, target }: { readonly race: RaceSummary } & Pick<Props, 'target'>) => (
  <article className="group bg-surface-container-lowest p-4 shadow-sm transition-all hover:bg-surface-bright">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <RaceTypeBadge type={race.type} />
        <span className="font-label font-medium text-[11px] text-on-surface-variant">
          Ronda {String(race.round).padStart(2, '0')}
          {race.type === 'sprint' ? ' · Sprint' : ''}
        </span>
      </div>
      <span className="font-label text-[11px] text-on-surface-variant">
        {formatNumericDate(race.date)}
      </span>
    </div>
    <div className="mt-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
      <RaceLink
        race={race}
        target={target}
        className="font-bold font-headline text-base text-on-surface uppercase tracking-tight transition-colors group-hover:text-tertiary"
      >
        {race.name}
      </RaceLink>
      <Winner name={race.winnerName} />
    </div>
    <div className="mt-3 flex items-center justify-between bg-surface-container px-3 py-1.5 font-label text-[11px]">
      <span className="text-on-surface-variant">{race.circuitName}</span>
      <RaceLink
        race={race}
        target={target}
        className="flex items-center gap-0.5 font-bold text-tertiary uppercase tracking-wider hover:underline"
      >
        {target === 'admin' ? 'Cargar resultado' : 'Clasificación'}
        <ChevronRight className="size-3" aria-hidden />
      </RaceLink>
    </div>
  </article>
)

export const SeasonRaceList = ({ races, target }: Props): ReactNode => (
  <div className="flex flex-col gap-2.5">
    {races.map((race) => (
      <RaceCard key={race.id} race={race} target={target} />
    ))}
  </div>
)
