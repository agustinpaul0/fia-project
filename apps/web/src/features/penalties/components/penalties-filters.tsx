import type { PenaltyType } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly selectedSeason?: number | undefined
  readonly selectedType?: PenaltyType | undefined
  readonly onSeasonChange: (season?: number | undefined) => void
  readonly onTypeChange: (type?: PenaltyType | undefined) => void
}

const SEASONS = [2026, 2025, 2024, 2023, 2022, 2021]

export const PenaltiesFilters = ({
  selectedSeason,
  selectedType,
  onSeasonChange,
  onTypeChange,
}: Props): ReactNode => (
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
        {SEASONS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
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
  </div>
)
