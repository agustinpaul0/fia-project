import { type ReactNode, useState } from 'react'
import { QueryView } from '@/components/common/query-view'
import { recentSeasons } from '@/lib/recent-seasons'
import { useSeasonRaces } from '../hooks/use-race-queries'
import { type RaceLinkTarget, SeasonRaceList } from './season-race-list'
import { SeasonSelect } from './season-select'

type Props = {
  readonly target: RaceLinkTarget
  readonly now?: Date
}

export const SeasonRacesPanel = ({ target, now = new Date() }: Props): ReactNode => {
  const seasons = recentSeasons(now)
  const [season, setSeason] = useState(seasons[1] ?? now.getFullYear())
  return (
    <section className="flex flex-col gap-3">
      <SeasonSelect seasons={seasons} value={season} onChange={setSeason} />
      <QueryView
        query={useSeasonRaces(season)}
        isEmpty={(races) => races.length === 0}
        emptyMessage="No hay carreras registradas para esta temporada."
      >
        {(races) => <SeasonRaceList races={races} target={target} />}
      </QueryView>
    </section>
  )
}
