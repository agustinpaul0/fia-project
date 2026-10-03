import type { TeamOption } from '@fia/shared/contracts'
import type { ComponentProps, ReactNode } from 'react'
import { describedBy, FIELD_CLASS, FieldMessage, LABEL_CLASS } from './field-message'

type Props = Omit<ComponentProps<'select'>, 'children'> & {
  readonly label: string
  readonly id: string
  readonly teams: readonly TeamOption[]
  readonly error?: string | undefined
}

export const TeamSelectField = ({ label, id, teams, error, ...props }: Props): ReactNode => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className={LABEL_CLASS}>
      {label}
    </label>
    <select
      id={id}
      aria-invalid={error !== undefined}
      aria-describedby={describedBy({ id, error, hint: undefined })}
      className={FIELD_CLASS}
      {...props}
    >
      <option value="">Seleccionar escudería</option>
      {teams.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
    <FieldMessage id={id} error={error} hint={undefined} />
  </div>
)
