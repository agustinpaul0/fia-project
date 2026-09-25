import type { CreateTeamStaffBody, TeamOption } from '@fia/shared/contracts'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { FormField } from './form-field'
import { TeamSelectField } from './team-select-field'

type FormSetter = Dispatch<SetStateAction<CreateTeamStaffBody>>

type Props = {
  readonly form: CreateTeamStaffBody
  readonly setForm: FormSetter
  readonly teams: readonly TeamOption[]
}

const PersonalFields = ({
  form,
  setForm,
}: {
  readonly form: CreateTeamStaffBody
  readonly setForm: FormSetter
}): ReactNode => (
  <>
    <div className="grid grid-cols-2 gap-2">
      <FormField
        id="c-fn"
        label="Nombre"
        required
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />
      <FormField
        id="c-ln"
        label="Apellido"
        required
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />
    </div>
    <FormField
      id="c-em"
      label="Correo electrónico"
      type="email"
      required
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
    />
    <FormField
      id="c-pw"
      label="Contraseña inicial"
      type="password"
      required
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
    />
  </>
)

const RoleFields = ({ form, setForm, teams }: Props): ReactNode => (
  <>
    <TeamSelectField
      id="c-tm"
      label="Escudería"
      required
      teams={teams}
      value={form.teamId}
      onChange={(e) => setForm({ ...form, teamId: e.target.value })}
    />
    <FormField
      id="c-rt"
      label="Cargo en la escudería"
      required
      value={form.roleInTeam}
      onChange={(e) => setForm({ ...form, roleInTeam: e.target.value })}
    />
    <div className="grid grid-cols-2 gap-2">
      <FormField
        id="c-ph"
        label="Teléfono"
        required
        placeholder="+54 9 291 1234567"
        value={form.phoneNumber}
        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
      />
      <FormField
        id="c-fl"
        label="Legajo"
        required
        placeholder="LEG-1234"
        value={form.fileNumber}
        onChange={(e) => setForm({ ...form, fileNumber: e.target.value })}
      />
    </div>
  </>
)

export const TeamStaffCreateFields = (props: Props): ReactNode => (
  <>
    <PersonalFields form={props.form} setForm={props.setForm} />
    <RoleFields {...props} />
  </>
)
