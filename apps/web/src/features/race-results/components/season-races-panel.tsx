import type { RaceSummary } from '@fia/shared/contracts'
import { applyClientFilters } from '@fia/shared/domain'
import { type ReactNode, useState } from 'react'
import { DataFiltersBar, EMPTY_FILTERS_MESSAGE } from '@/components/common/data-filters-bar'
import { QueryView } from '@/components/common/query-view'
import { StaleFade } from '@/components/common/stale-fade'
import { type CommonFilters, useCommonFilters } from '@/components/common/use-common-filters'
import type { SeasonScope } from '../api/race-results-api'
import { useSeasonRaces } from '../hooks/use-race-queries'
import { IdentifierField } from './identifier-field'
import { type RaceLinkTarget, SeasonRaceList } from './season-race-list'

export const NO_RACES_MESSAGE = 'No hay carreras registradas para esta temporada.'

type Props = {
  readonly scope: SeasonScope
  readonly target: RaceLinkTarget
  readonly now?: Date | undefined
}

const matchesEvent = (race: RaceSummary, text: string): boolean =>
  `${race.name} ${race.circuitName}`.toLowerCase().includes(text.trim().toLowerCase())

export const filterRaces = (
  races: readonly RaceSummary[],
  { filters, event, now }: { filters: CommonFilters; event: string; now: Date },
): readonly RaceSummary[] =>
  applyClientFilters(
    races.filter((r) => matchesEvent(r, event)),
    { ...filters.query, season: undefined, sort: filters.query.sort ?? 'relevance' },
    now,
  )

export const SeasonRaces = ({ scope, target, now = new Date() }: Props): ReactNode => {
  const query = useSeasonRaces(scope)
  const filters = useCommonFilters()
  const [event, setEvent] = useState('')
  return (
    <div className="flex flex-col gap-3">
      <DataFiltersBar
        filters={filters}
        withSeason={false}
        hasExtraFilters={event !== ''}
        onReset={() => setEvent('')}
      >
        <IdentifierField id="filter-event" label="Evento:" value={event} onChange={setEvent} />
      </DataFiltersBar>
      <QueryView
        query={query}
        isEmpty={(races) => races.length === 0}
        emptyMessage={NO_RACES_MESSAGE}
      >
        {(races) => {
          const visible = filterRaces(races, { filters, event, now })
          return visible.length === 0 ? (
            <p className="font-mono text-on-surface-variant text-sm">{EMPTY_FILTERS_MESSAGE}</p>
          ) : (
            <StaleFade stale={query.isPlaceholderData}>
              <SeasonRaceList races={visible} target={target} />
            </StaleFade>
          )
        }}
      </QueryView>
    </div>
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
