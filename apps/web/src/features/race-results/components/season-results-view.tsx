import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { StaleFade } from '@/components/common/stale-fade'
import { useSeasonRaces, useSeasonStandings } from '../hooks/use-race-queries'
import { useSeasonSelection } from '../hooks/use-season-selection'
import { CategoryRibbon } from './category-ribbon'
import { SeasonHero } from './season-hero'
import { SeasonMetrics } from './season-metrics'
import { RacesHeading, SeasonRaces } from './season-races-panel'
import { SeasonSelect } from './season-select'
import { StandingsCard, StandingsHeading } from './standings-panel'

export const NO_STANDINGS_MESSAGE = 'Todavía no hay puntos sumados en esta temporada.'

type Props = {
  readonly category: string
  readonly now?: Date
}

export const SeasonResultsView = ({ category, now = new Date() }: Props): ReactNode => {
  const { seasons, season, setSeason } = useSeasonSelection(now)
  const scope = { season, category }
  const standings = useSeasonStandings(scope)
  const races = useSeasonRaces(scope)
  return (
    <div className="flex w-full flex-col">
      <SeasonHero eyebrow="Oficial FIA Motorsport · Tablero de datos" title="Resultados">
        <SeasonSelect seasons={seasons} value={season} onChange={setSeason} />
      </SeasonHero>
      <SeasonMetrics standings={standings.data} races={races.data} />
      <CategoryRibbon current={category} />
      <div className="w-full px-6 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <section className="flex flex-col gap-4 lg:col-span-7">
            <StandingsHeading season={season} />
            <QueryView
              query={standings}
              isEmpty={(list) => list.length === 0}
              emptyMessage={NO_STANDINGS_MESSAGE}
            >
              {(list) => (
                <StaleFade stale={standings.isPlaceholderData}>
                  <StandingsCard standings={list} />
                </StaleFade>
              )}
            </QueryView>
          </section>
          <section className="flex flex-col gap-4 lg:col-span-5">
            <RacesHeading season={season} />
            <SeasonRaces scope={scope} target="public" />
          </section>
        </div>
      </div>
    </div>
  )
}
