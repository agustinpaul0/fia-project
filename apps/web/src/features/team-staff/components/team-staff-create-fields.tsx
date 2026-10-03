import type { CreateTeamStaffBody, TeamOption } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateInput } from '../staff-form-schemas'
import { FormField } from './form-field'
import { TeamSelectField } from './team-select-field'

type Props = {
  readonly form: UseFormReturn<CreateInput, unknown, CreateTeamStaffBody>
  readonly teams: readonly TeamOption[]
}

export const PASSWORD_HINT =
  'Mínimo 12 caracteres, con al menos una mayúscula, una minúscula y un número.'
export const PHONE_HINT = 'Entre 7 y 30 caracteres: números, espacios, +, paréntesis y guiones.'
export const FILE_NUMBER_HINT = 'Hasta 20 letras, números o guiones (ej. LEG-1234).'

const PersonalFields = ({ form }: Pick<Props, 'form'>): ReactNode => {
  const { register, formState } = form
  const { errors } = formState
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          id="c-fn"
          label="Nombre"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <FormField
          id="c-ln"
          label="Apellido"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <FormField
        id="c-em"
        label="Correo electrónico"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormField
        id="c-pw"
        label="Contraseña inicial"
        type="password"
        hint={PASSWORD_HINT}
        error={errors.password?.message}
        {...register('password')}
      />
    </>
  )
}

const RoleFields = ({ form, teams }: Props): ReactNode => {
  const { register, formState } = form
  const { errors } = formState
  return (
    <>
      <TeamSelectField
        id="c-tm"
        label="Escudería"
        teams={teams}
        error={errors.teamId?.message}
        {...register('teamId')}
      />
      <FormField
        id="c-rt"
        label="Cargo en la escudería"
        error={errors.roleInTeam?.message}
        {...register('roleInTeam')}
      />
      <div className="grid grid-cols-2 gap-2">
        <FormField
          id="c-ph"
          label="Teléfono"
          placeholder="+54 9 291 1234567"
          hint={PHONE_HINT}
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <FormField
          id="c-fl"
          label="Legajo"
          placeholder="LEG-1234"
          hint={FILE_NUMBER_HINT}
          error={errors.fileNumber?.message}
          {...register('fileNumber')}
        />
      </div>
    </>
  )
}

export const TeamStaffCreateFields = (props: Props): ReactNode => (
  <>
    <PersonalFields form={props.form} />
    <RoleFields {...props} />
  </>
)
