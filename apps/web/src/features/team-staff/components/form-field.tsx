import type { ComponentProps, ReactNode } from 'react'
import { describedBy, FIELD_CLASS, FieldMessage, LABEL_CLASS } from './field-message'

type Props = ComponentProps<'input'> & {
  readonly label: string
  readonly id: string
  readonly error?: string | undefined
  readonly hint?: string | undefined
}

export const FormField = ({ label, id, error, hint, ...props }: Props): ReactNode => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className={LABEL_CLASS}>
      {label}
    </label>
    <input
      id={id}
      aria-invalid={error !== undefined}
      aria-describedby={describedBy({ id, error, hint })}
      className={FIELD_CLASS}
      {...props}
    />
    <FieldMessage id={id} error={error} hint={hint} />
  </div>
)
