import type { TeamOption, TeamStaff } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { EditInput, EditOutput } from '../staff-form-schemas'
import { FormField } from './form-field'
import { TeamSelectField } from './team-select-field'
import { PHONE_HINT } from './team-staff-create-fields'

type Props = {
  readonly form: UseFormReturn<EditInput, unknown, EditOutput>
  readonly member: TeamStaff
  readonly teams: readonly TeamOption[]
}

export const TeamStaffEditFields = ({ form, member, teams }: Props): ReactNode => {
  const { register, formState } = form
  const { errors } = formState
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          id="e-fn"
          label="Nombre"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <FormField
          id="e-ln"
          label="Apellido"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <TeamSelectField
        id="e-tm"
        label="Escudería"
        teams={teams}
        error={errors.teamId?.message}
        {...register('teamId')}
      />
      <FormField
        id="e-rt"
        label="Cargo en la escudería"
        error={errors.roleInTeam?.message}
        {...register('roleInTeam')}
      />
      <FormField
        id="e-ph"
        label="Teléfono"
        hint={PHONE_HINT}
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />
      <div className="grid grid-cols-2 gap-2">
        <FormField id="e-em" label="Correo electrónico (inmutable)" disabled value={member.email} />
        <FormField id="e-fl" label="Legajo (inmutable)" disabled value={member.fileNumber} />
      </div>
    </>
  )
}
