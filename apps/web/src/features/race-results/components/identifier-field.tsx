import type { ReactNode } from 'react'
import { LABEL } from '@/components/common/data-filters-fields'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
}

export const IdentifierField = ({ id, label, value, onChange }: Props): ReactNode => (
  <div className="flex items-center gap-2">
    <label htmlFor={id} className={LABEL}>
      {label}
    </label>
    <input
      id={id}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${FIELD_CLASS} w-40 font-mono text-xs`}
    />
  </div>
)
