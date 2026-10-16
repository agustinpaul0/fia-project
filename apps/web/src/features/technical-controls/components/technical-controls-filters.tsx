import type { TechnicalControlStatus, TechnicalControlType } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly selectedSeason?: number | undefined
  readonly selectedControlType?: TechnicalControlType | undefined
  readonly selectedStatus?: TechnicalControlStatus | undefined
  readonly onSeasonChange: (season?: number | undefined) => void
  readonly onControlTypeChange: (type?: TechnicalControlType | undefined) => void
  readonly onStatusChange: (status?: TechnicalControlStatus | undefined) => void
}

const SEASONS = [2026, 2025, 2024, 2023, 2022, 2021]

export const TechnicalControlsFilters = ({
  selectedSeason,
  selectedControlType,
  selectedStatus,
  onSeasonChange,
  onControlTypeChange,
  onStatusChange,
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
        value={selectedControlType ?? ''}
        onChange={(e) =>
          onControlTypeChange(e.target.value ? (e.target.value as TechnicalControlType) : undefined)
        }
        className={`${FIELD_CLASS} w-auto font-mono text-xs`}
      >
        <option value="">Todos los tipos</option>
        <option value="weight">Pesaje</option>
        <option value="fuel">Combustible</option>
        <option value="dimensions">Dimensiones</option>
        <option value="engine">Motor y Potencia</option>
        <option value="safety">Seguridad</option>
        <option value="post_race">Post-Carrera</option>
      </select>
    </div>
    <div className="flex items-center gap-2">
      <label htmlFor="filter-status" className="font-bold font-mono text-xs uppercase">
        Resultado:
      </label>
      <select
        id="filter-status"
        value={selectedStatus ?? ''}
        onChange={(e) =>
          onStatusChange(e.target.value ? (e.target.value as TechnicalControlStatus) : undefined)
        }
        className={`${FIELD_CLASS} w-auto font-mono text-xs`}
      >
        <option value="">Todos los resultados</option>
        <option value="passed">Aprobado</option>
        <option value="rejected">Rechazado</option>
      </select>
    </div>
  </div>
)
