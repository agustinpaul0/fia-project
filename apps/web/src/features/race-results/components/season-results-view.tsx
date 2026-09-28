import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useSeasonStandings } from '../hooks/use-race-queries'
import { useSeasonSelection } from '../hooks/use-season-selection'
import { SeasonRaces } from './season-races-panel'
import { SeasonSelect } from './season-select'
import { StandingsTable } from './standings-table'

export const NO_STANDINGS_MESSAGE = 'Todavía no hay puntos sumados en esta temporada.'

export const SeasonResultsView = ({ now = new Date() }: { readonly now?: Date }): ReactNode => {
  const { seasons, season, setSeason } = useSeasonSelection(now)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Resultados</h2>
        <SeasonSelect seasons={seasons} value={season} onChange={setSeason} />
      </div>
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold">Campeonato de pilotos {season}</h3>
        <QueryView
          query={useSeasonStandings(season)}
          isEmpty={(list) => list.length === 0}
          emptyMessage={NO_STANDINGS_MESSAGE}
        >
          {(standings) => <StandingsTable standings={standings} />}
        </QueryView>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="font-semibold">Carreras</h3>
        <SeasonRaces season={season} target="public" />
      </section>
    </div>
  )
}
