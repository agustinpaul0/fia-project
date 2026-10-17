import type { CreateTechnicalControlBody, CreateTechnicalControlInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS, LABEL_CLASS } from '@/features/team-staff/components/field-message'
import { argentinaInputToUtcIso } from '@/lib/argentina-date-input'

type Props = {
  readonly form: UseFormReturn<CreateTechnicalControlInput, unknown, CreateTechnicalControlBody>
}

type DateField = 'inspectedAt' | 'expiresAt'

const LABELS: Readonly<Record<DateField, string>> = {
  inspectedAt: 'Fecha y hora del control',
  expiresAt: 'Vigente hasta',
}

export const TechnicalControlDatesFields = ({ form }: Props): ReactNode => (
  <div className="grid grid-cols-2 gap-3">
    {(['inspectedAt', 'expiresAt'] as const).map((name) => (
      <div key={name} className="flex flex-col gap-1">
        <label htmlFor={name} className={LABEL_CLASS}>
          {LABELS[name]}
        </label>
        <input
          id={name}
          type="datetime-local"
          {...form.register(name, { setValueAs: argentinaInputToUtcIso })}
          className={FIELD_CLASS}
        />
        {form.formState.errors[name] && (
          <span className="text-secondary text-xs">{form.formState.errors[name]?.message}</span>
        )}
      </div>
    ))}
  </div>
)
