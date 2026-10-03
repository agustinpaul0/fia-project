import type { RaceSummary } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { formatDateTime, formatNumericDate } from '@/lib/format-date-time'

const Fact = ({
  label,
  value,
  note,
}: {
  readonly label: string
  readonly value: string
  readonly note: string
}): ReactNode => (
  <div className="flex flex-col bg-surface-tint/60 p-3">
    <span className="font-label text-[10px] text-outline-variant uppercase tracking-wider">
      {label}
    </span>
    <span className="mt-0.5 truncate font-bold font-headline text-on-primary text-xs sm:text-sm">
      {value}
    </span>
    <span className="font-mono text-[10px] text-surface-variant">{note}</span>
  </div>
)

export const factsRevisionLabel = (revision: number, hasResults: boolean): string => {
  if (revision > 0) {
    return `Revisión ${revision}`
  }
  return hasResults ? 'Datos históricos' : 'Sin cargar'
}

const timeOf = (iso: string): string => formatDateTime(iso).split(', ')[1] ?? ''

type Props = {
  readonly race: RaceSummary
  readonly hasResults: boolean
}

export const RaceFacts = ({ race, hasResults }: Props): ReactNode => (
  <div className="grid grid-cols-2 gap-3 pt-4 md:grid-cols-4">
    <Fact label="Circuito" value={race.circuitName} note={`Ronda ${race.round}`} />
    <Fact
      label="Fecha del evento"
      value={formatNumericDate(race.date)}
      note={`${timeOf(race.date)} h (hora argentina)`}
    />
    <Fact
      label="Temporada"
      value={String(race.seasonYear)}
      note={`Categoría ${race.categoryCode}`}
    />
    <Fact
      label="Revisión de resultados"
      value={factsRevisionLabel(race.resultsRevision, hasResults)}
      note="Cada corrección suma una revisión"
    />
  </div>
)
