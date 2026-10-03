import type { DriverStanding } from '@fia/shared/contracts'
import { ArrowRight, Flag } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { STANDINGS_PREVIEW_SIZE, visibleStandings } from '../season/season-summary'
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
