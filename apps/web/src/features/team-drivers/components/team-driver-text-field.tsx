import type { CreateTeamDriverBody, CreateTeamDriverInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'
import { TeamDriverInputField } from './team-driver-input-field'

type TextFieldName = 'firstName' | 'lastName' | 'code' | 'country' | 'license'

type Props = {
  readonly form: UseFormReturn<CreateTeamDriverInput, unknown, CreateTeamDriverBody>
  readonly name: TextFieldName
  readonly label: string
  readonly placeholder: string
  readonly className?: string
  readonly maxLength?: number
}

export const TeamDriverTextField = ({ form, name, label, ...input }: Props): ReactNode => (
  <TeamDriverInputField id={name} label={label} error={form.formState.errors[name]?.message}>
    <input
      id={name}
      {...form.register(name)}
      placeholder={input.placeholder}
      maxLength={input.maxLength}
      className={`${FIELD_CLASS} ${input.className ?? ''}`}
    />
  </TeamDriverInputField>
)
