import type { PenaltyType } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { DataFiltersBar } from '@/components/common/data-filters-bar'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly selectedSeason?: number | undefined
  readonly selectedType?: PenaltyType | undefined
  readonly onSeasonChange: (season?: number | undefined) => void
  readonly onTypeChange: (type?: PenaltyType | undefined) => void
}

export const PenaltiesFilters = ({
  selectedSeason,
  selectedType,
  onSeasonChange,
  onTypeChange,
}: Props): ReactNode => (
  <DataFiltersBar
    selectedSeason={selectedSeason}
    onSeasonChange={onSeasonChange}
    hasActiveFilters={selectedSeason !== undefined || selectedType !== undefined}
    onReset={() => {
      onSeasonChange(undefined)
      onTypeChange(undefined)
    }}
  >
    <div className="flex items-center gap-2">
      <label htmlFor="filter-type" className="font-bold font-mono text-xs uppercase">
        Tipo:
      </label>
      <select
        id="filter-type"
        value={selectedType ?? ''}
        onChange={(e) => onTypeChange(e.target.value ? (e.target.value as PenaltyType) : undefined)}
        className={`${FIELD_CLASS} w-auto font-mono text-xs`}
      >
        <option value="">Todos los tipos</option>
        <option value="time_penalty">Recargo de tiempo</option>
        <option value="grid_penalty">Puestos en grilla</option>
        <option value="points_deduction">Quita de puntos</option>
        <option value="disqualification">Descalificación</option>
        <option value="fine">Multa económica</option>
        <option value="reprimand">Apercibimiento</option>
      </select>
    </div>
  </DataFiltersBar>
)
