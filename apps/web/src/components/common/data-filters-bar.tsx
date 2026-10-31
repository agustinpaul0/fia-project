import type { ReactNode } from 'react'
import { recentSeasons } from '@/lib/recent-seasons'
import { DateRangeFields, SeasonField, SortField } from './data-filters-fields'
import type { CommonFilters } from './use-common-filters'

export const EMPTY_FILTERS_MESSAGE = 'Sin resultados.'

export type DataFiltersBarProps = {
  readonly filters: CommonFilters
  readonly onReset?: (() => void) | undefined
  readonly hasExtraFilters?: boolean | undefined
  readonly withSeason?: boolean | undefined
  readonly now?: Date | undefined
  readonly children?: ReactNode | undefined
}

export const DataFiltersBar = ({
  filters,
  onReset,
  hasExtraFilters = false,
  withSeason = true,
  now = new Date(),
  children,
}: DataFiltersBarProps): ReactNode => (
  <div className="flex flex-col gap-2 border-2 border-outline bg-surface p-4 shadow-brutal-sm">
    <div className="flex flex-wrap items-center gap-3">
      {withSeason ? (
        <SeasonField
          values={filters.values}
          onChange={filters.setValues}
          seasons={recentSeasons(now)}
        />
      ) : null}
      <DateRangeFields values={filters.values} onChange={filters.setValues} />
      {children}
      <SortField values={filters.values} onChange={filters.setValues} />
      {filters.isActive || hasExtraFilters ? (
        <button
          type="button"
          onClick={() => {
            filters.reset()
            onReset?.()
          }}
          className="ml-auto border border-black bg-white px-3 py-1.5 font-bold font-mono text-xs uppercase hover:bg-surface-container"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
    {filters.rangeError ? (
      <p role="alert" className="font-mono text-secondary text-xs">
        {filters.rangeError}
      </p>
    ) : null}
  </div>
)
