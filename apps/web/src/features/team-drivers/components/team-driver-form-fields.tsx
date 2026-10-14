import type { CreateTeamDriverBody, CreateTeamDriverInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'
import { TeamDriverInputField } from './team-driver-input-field'

type Props = {
  readonly form: UseFormReturn<CreateTeamDriverInput, unknown, CreateTeamDriverBody>
}

export const TeamDriverFormFields = ({ form }: Props): ReactNode => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <TeamDriverInputField id="firstName" label="Nombre" error={errors.firstName?.message}>
          <input
            id="firstName"
            {...register('firstName')}
            placeholder="Ej: Carlos"
            className={FIELD_CLASS}
          />
        </TeamDriverInputField>
        <TeamDriverInputField id="lastName" label="Apellido" error={errors.lastName?.message}>
          <input
            id="lastName"
            {...register('lastName')}
            placeholder="Ej: Sainz"
            className={FIELD_CLASS}
          />
        </TeamDriverInputField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TeamDriverInputField id="code" label="Código (3 letras)" error={errors.code?.message}>
          <input
            id="code"
            maxLength={3}
            {...register('code')}
            placeholder="SAI"
            className={`${FIELD_CLASS} uppercase font-mono`}
          />
        </TeamDriverInputField>
        <TeamDriverInputField id="number" label="Dorsal (1-99)" error={errors.number?.message}>
          <input
            id="number"
            type="number"
            min={1}
            max={99}
            {...register('number', { valueAsNumber: true })}
            className={FIELD_CLASS}
          />
        </TeamDriverInputField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TeamDriverInputField
          id="country"
          label="Nacionalidad / País"
          error={errors.country?.message}
        >
          <input
            id="country"
            {...register('country')}
            placeholder="España"
            className={FIELD_CLASS}
          />
        </TeamDriverInputField>
        <TeamDriverInputField id="role" label="Condición" error={errors.role?.message}>
          <select id="role" {...register('role')} className={`${FIELD_CLASS} font-mono`}>
            <option value="main">Titular</option>
            <option value="reserve">Suplente</option>
          </select>
        </TeamDriverInputField>
      </div>
    </div>
  )
}
