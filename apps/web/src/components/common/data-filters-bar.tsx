import type { ReactNode } from 'react'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

export const EMPTY_FILTERS_MESSAGE = 'Sin resultados que coincidan con los filtros aplicados.'

const DEFAULT_SEASONS = [2026, 2025, 2024, 2023, 2022, 2021] as const

export type DataFiltersBarProps = {
  readonly selectedSeason?: number | undefined
  readonly onSeasonChange: (season?: number | undefined) => void
  readonly hasActiveFilters?: boolean | undefined
  readonly onReset?: (() => void) | undefined
  readonly children?: ReactNode | undefined
}

export const DataFiltersBar = ({
  selectedSeason,
  onSeasonChange,
  hasActiveFilters = false,
  onReset,
  children,
}: DataFiltersBarProps): ReactNode => (
  <div className="flex flex-wrap items-center gap-3 border-2 border-outline bg-surface p-4 shadow-brutal-sm">
    <div className="flex items-center gap-2">
      <label htmlFor="filter-season" className="font-bold font-mono text-xs uppercase">
        Temporada:
      </label>
      <select
        id="filter-season"
        value={selectedSeason ?? ''}
        onChange={(e) => onSeasonChange(e.target.value ? Number(e.target.value) : undefined)}
        className={`${FIELD_CLASS} w-auto font-mono text-xs`}
      >
        <option value="">Todas</option>
        {DEFAULT_SEASONS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
    {children}
    {hasActiveFilters && onReset ? (
      <button
        type="button"
        onClick={onReset}
        className="ml-auto border border-black bg-white px-3 py-1.5 font-bold font-mono text-xs uppercase hover:bg-surface-container"
      >
        Limpiar filtros
      </button>
    ) : null}
  </div>
)
