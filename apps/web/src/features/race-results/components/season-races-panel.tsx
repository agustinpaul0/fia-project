import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useSeasonRaces } from '../hooks/use-race-queries'
import { useSeasonSelection } from '../hooks/use-season-selection'
import { type RaceLinkTarget, SeasonRaceList } from './season-race-list'
import { SeasonSelect } from './season-select'

export const NO_RACES_MESSAGE = 'No hay carreras registradas para esta temporada.'

export const SeasonRaces = ({
  season,
  target,
}: {
  readonly season: number
  readonly target: RaceLinkTarget
}): ReactNode => (
  <QueryView
    query={useSeasonRaces(season)}
    isEmpty={(races) => races.length === 0}
    emptyMessage={NO_RACES_MESSAGE}
  >
    {(races) => <SeasonRaceList races={races} target={target} />}
  </QueryView>
)

type Props = {
  readonly target: RaceLinkTarget
  readonly now?: Date
}

export const SeasonRacesPanel = ({ target, now = new Date() }: Props): ReactNode => {
  const { seasons, season, setSeason } = useSeasonSelection(now)
  return (
    <section className="flex flex-col gap-3">
      <SeasonSelect seasons={seasons} value={season} onChange={setSeason} />
      <SeasonRaces season={season} target={target} />
    </section>
  )
}
