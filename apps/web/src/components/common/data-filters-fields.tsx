import type { SortOrder } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'
import type { CommonFilterValues } from './use-common-filters'

export const LABEL = 'font-bold font-mono text-xs uppercase'
const SELECT = `${FIELD_CLASS} w-auto font-mono text-xs`

type FieldProps = {
  readonly values: CommonFilterValues
  readonly onChange: (values: CommonFilterValues) => void
}

export const SeasonField = ({
  values,
  onChange,
  seasons,
}: FieldProps & { readonly seasons: readonly number[] }): ReactNode => (
  <div className="flex items-center gap-2">
    <label htmlFor="filter-season" className={LABEL}>
      Temporada:
    </label>
    <select
      id="filter-season"
      value={values.season ?? ''}
      onChange={(e) =>
        onChange({ ...values, season: e.target.value ? Number(e.target.value) : undefined })
      }
      className={SELECT}
    >
      <option value="">Todas</option>
      {seasons.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  </div>
)

export const DateRangeFields = ({ values, onChange }: FieldProps): ReactNode => (
  <>
    <div className="flex items-center gap-2">
      <label htmlFor="filter-from" className={LABEL}>
        Desde:
      </label>
      <input
        id="filter-from"
        type="date"
        className={SELECT}
        value={values.fromDay ?? ''}
        onChange={(e) => onChange({ ...values, fromDay: e.target.value || undefined })}
      />
    </div>
    <div className="flex items-center gap-2">
      <label htmlFor="filter-to" className={LABEL}>
        Hasta:
      </label>
      <input
        id="filter-to"
        type="date"
        className={SELECT}
        value={values.toDay ?? ''}
        onChange={(e) => onChange({ ...values, toDay: e.target.value || undefined })}
      />
    </div>
  </>
)

const SORT_LABELS: Readonly<Record<SortOrder, string>> = {
  relevance: 'Relevancia',
  date_desc: 'Más recientes',
  date_asc: 'Más antiguos',
}

export const SortField = ({ values, onChange }: FieldProps): ReactNode => (
  <div className="flex items-center gap-2">
    <label htmlFor="filter-sort" className={LABEL}>
      Orden:
    </label>
    <select
      id="filter-sort"
      value={values.sort ?? 'relevance'}
      onChange={(e) => onChange({ ...values, sort: e.target.value as SortOrder })}
      className={SELECT}
    >
      {Object.entries(SORT_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
)
