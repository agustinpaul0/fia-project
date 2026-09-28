import type { RaceSummary } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { formatDateTime } from '@/lib/format-date-time'
import { RaceTypeBadge } from './race-type-badge'

export const RaceHeader = ({ race }: { readonly race: RaceSummary }): ReactNode => (
  <header className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-semibold">{race.name}</h2>
      <RaceTypeBadge type={race.type} />
    </div>
    <p className="text-sm text-muted-foreground">
      {race.categoryCode} · Temporada {race.seasonYear} · Ronda {race.round} · {race.circuitName} ·{' '}
      {formatDateTime(race.date)} (hora argentina)
    </p>
  </header>
)
