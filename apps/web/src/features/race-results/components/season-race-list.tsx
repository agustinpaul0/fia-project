import type { RaceSummary } from '@fia/shared/contracts'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { formatDate } from '@/lib/format-date-time'
import { RaceTypeBadge } from './race-type-badge'

export type RaceLinkTarget = 'public' | 'admin'

type Props = {
  readonly races: readonly RaceSummary[]
  readonly target: RaceLinkTarget
}

const RaceLink = ({ race, target }: { readonly race: RaceSummary } & Pick<Props, 'target'>) => {
  const params = { raceId: race.id }
  const className = 'font-medium underline-offset-4 hover:underline'
  return target === 'admin' ? (
    <Link to="/admin/results/$raceId" params={params} className={className}>
      {race.name}
    </Link>
  ) : (
    <Link to="/races/$raceId" params={params} className={className}>
      {race.name}
    </Link>
  )
}

export const SeasonRaceList = ({ races, target }: Props): ReactNode => (
  <ul className="flex flex-col divide-y rounded-md border">
    {races.map((race) => (
      <li key={race.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2">
          <RaceTypeBadge type={race.type} />
          <RaceLink race={race} target={target} />
        </div>
        <span className="text-sm text-muted-foreground">
          {formatDate(race.date)} · {race.winnerName ?? 'Sin resultados'}
        </span>
      </li>
    ))}
  </ul>
)
