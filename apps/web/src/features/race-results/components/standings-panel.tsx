import type { DriverStanding } from '@fia/shared/contracts'
import { ArrowRight, Flag } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { EMPTY_FILTERS_MESSAGE } from '@/components/common/data-filters-bar'
import { STANDINGS_PREVIEW_SIZE, visibleStandings } from '../season/season-summary'
import { IdentifierField } from './identifier-field'
import { StandingsTable } from './standings-table'

type Props = { readonly standings: readonly DriverStanding[] }

export const StandingsCard = ({ standings }: Props): ReactNode => {
  const [expanded, setExpanded] = useState(false)
  const shown = visibleStandings(standings, expanded)
  return (
    <div className="overflow-hidden bg-surface-container-lowest shadow-md">
      <StandingsTable standings={shown} />
      <div className="flex items-center justify-between gap-3 bg-surface-container px-4 py-3 font-label text-xs">
        <span className="text-on-surface-variant">
          Mostrando {shown.length} de {standings.length} pilotos
        </span>
        {standings.length > STANDINGS_PREVIEW_SIZE ? (
          <button
            type="button"
            className="flex items-center gap-1 font-bold text-tertiary uppercase tracking-wider hover:underline"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Ver sólo los primeros' : 'Ver tabla completa'}
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export const StandingsHeading = ({ season }: { readonly season: number }): ReactNode => (
  <div className="flex items-center justify-between bg-primary px-5 py-3 text-on-primary">
    <div className="flex items-center gap-3">
      <Flag className="size-5 text-primary-container" aria-hidden />
      <h2 className="font-bold font-headline text-lg uppercase tracking-wide">
        Campeonato de pilotos {season}
      </h2>
    </div>
    <span className="bg-surface-tint px-2 py-0.5 font-label text-[10px] text-surface-variant uppercase tracking-widest">
      Clasificación FIA
    </span>
  </div>
)

export const filterStandings = (
  standings: readonly DriverStanding[],
  text: string,
): readonly DriverStanding[] => {
  const needle = text.trim().toLowerCase()
  return standings.filter((s) =>
    `${s.driverName} ${s.driverCode} ${s.teamName}`.toLowerCase().includes(needle),
  )
}

export const FilteredStandings = ({ standings }: Props): ReactNode => {
  const [text, setText] = useState('')
  const visible = filterStandings(standings, text)
  return (
    <div className="flex flex-col gap-3">
      <IdentifierField
        id="filter-standings"
        label="Piloto o escudería:"
        value={text}
        onChange={setText}
      />
      {visible.length === 0 ? (
        <p className="font-mono text-on-surface-variant text-sm">{EMPTY_FILTERS_MESSAGE}</p>
      ) : (
        <StandingsCard standings={visible} />
      )}
    </div>
  )
}
