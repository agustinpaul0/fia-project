import type { TechnicalControlStatus, TechnicalControlType } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { DataFiltersBar } from '@/components/common/data-filters-bar'
import type { CommonFilters } from '@/components/common/use-common-filters'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly filters: CommonFilters
  readonly selectedControlType?: TechnicalControlType | undefined
  readonly selectedStatus?: TechnicalControlStatus | undefined
  readonly onControlTypeChange: (type?: TechnicalControlType | undefined) => void
  readonly onStatusChange: (status?: TechnicalControlStatus | undefined) => void
}

const TypeSelect = ({
  value,
  onChange,
}: {
  readonly value?: TechnicalControlType | undefined
  readonly onChange: (type?: TechnicalControlType | undefined) => void
}): ReactNode => (
  <div className="flex items-center gap-2">
    <label htmlFor="filter-type" className="font-bold font-mono text-xs uppercase">
      Tipo:
    </label>
    <select
      id="filter-type"
      value={value ?? ''}
      onChange={(e) =>
        onChange(e.target.value ? (e.target.value as TechnicalControlType) : undefined)
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
)

export const TechnicalControlsFilters = (p: Props): ReactNode => (
  <DataFiltersBar
    filters={p.filters}
    hasExtraFilters={p.selectedControlType !== undefined || p.selectedStatus !== undefined}
    onReset={() => {
      p.onControlTypeChange(undefined)
      p.onStatusChange(undefined)
    }}
  >
    <TypeSelect value={p.selectedControlType} onChange={p.onControlTypeChange} />
    <div className="flex items-center gap-2">
      <label htmlFor="filter-status" className="font-bold font-mono text-xs uppercase">
        Resultado:
      </label>
      <select
        id="filter-status"
        value={p.selectedStatus ?? ''}
        onChange={(e) =>
          p.onStatusChange(e.target.value ? (e.target.value as TechnicalControlStatus) : undefined)
        }
        className={`${FIELD_CLASS} w-auto font-mono text-xs`}
      >
        <option value="">Todos los resultados</option>
        <option value="passed">Aprobado</option>
        <option value="rejected">Rechazado</option>
      </select>
    </div>
  </DataFiltersBar>
)
