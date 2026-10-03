import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { StaleFade } from '@/components/common/stale-fade'
import type { SeasonScope } from '../api/race-results-api'
import { useSeasonRaces } from '../hooks/use-race-queries'
import { type RaceLinkTarget, SeasonRaceList } from './season-race-list'

export const NO_RACES_MESSAGE = 'No hay carreras registradas para esta temporada.'

type Props = {
  readonly scope: SeasonScope
  readonly target: RaceLinkTarget
}

export const SeasonRaces = ({ scope, target }: Props): ReactNode => {
  const query = useSeasonRaces(scope)
  return (
    <QueryView
      query={query}
      isEmpty={(races) => races.length === 0}
      emptyMessage={NO_RACES_MESSAGE}
    >
      {(races) => (
        <StaleFade stale={query.isPlaceholderData}>
          <SeasonRaceList races={races} target={target} />
        </StaleFade>
      )}
    </QueryView>
  )
}

export const RacesHeading = ({ season }: { readonly season: number }): ReactNode => (
  <div className="bg-surface-container-high px-5 py-3">
    <div className="flex items-center justify-between">
      <h2 className="font-bold font-headline text-lg text-on-surface uppercase tracking-wide">
        Carreras
      </h2>
      <span className="bg-primary px-2 py-0.5 font-bold font-label text-[11px] text-on-primary uppercase">
        {season}
      </span>
    </div>
    <p className="mt-0.5 font-label text-on-surface-variant text-xs uppercase tracking-wider">
      Calendario y clasificaciones oficiales
    </p>
  </div>
)
