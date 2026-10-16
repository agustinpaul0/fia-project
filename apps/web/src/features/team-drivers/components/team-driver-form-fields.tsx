import type { CreateTeamDriverBody, CreateTeamDriverInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'
import { TeamDriverInputField } from './team-driver-input-field'
import { TeamDriverTextField } from './team-driver-text-field'

type Props = {
  readonly form: UseFormReturn<CreateTeamDriverInput, unknown, CreateTeamDriverBody>
}

export const TeamDriverFormFields = ({ form }: Props): ReactNode => {
  const { errors } = form.formState
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <TeamDriverTextField form={form} name="firstName" label="Nombre" placeholder="Ej: Carlos" />
        <TeamDriverTextField form={form} name="lastName" label="Apellido" placeholder="Ej: Sainz" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TeamDriverTextField
          form={form}
          name="code"
          label="Código (3 letras)"
          placeholder="SAI"
          maxLength={3}
          className="uppercase font-mono"
        />
        <TeamDriverInputField id="number" label="Dorsal (1-99)" error={errors.number?.message}>
          <input
            id="number"
            type="number"
            min={1}
            max={99}
            {...form.register('number', { valueAsNumber: true })}
            className={FIELD_CLASS}
          />
        </TeamDriverInputField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TeamDriverTextField
          form={form}
          name="country"
          label="Nacionalidad / País"
          placeholder="España"
        />
        <TeamDriverTextField
          form={form}
          name="license"
          label="Licencia deportiva"
          placeholder="FIA-55-SAI"
          className="font-mono"
        />
      </div>
      <TeamDriverInputField id="role" label="Condición" error={errors.role?.message}>
        <select id="role" {...form.register('role')} className={`${FIELD_CLASS} font-mono`}>
          <option value="main">Titular</option>
          <option value="reserve">Suplente</option>
        </select>
      </TeamDriverInputField>
    </div>
  )
}
