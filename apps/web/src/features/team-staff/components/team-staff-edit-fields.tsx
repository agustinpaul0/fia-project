import type { TeamOption, TeamStaff } from '@fia/shared/contracts'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { FormField } from './form-field'
import { TeamSelectField } from './team-select-field'

export type EditFormData = {
  firstName: string
  lastName: string
  teamId: string
  roleInTeam: string
  phoneNumber: string
}

type Props = {
  readonly form: EditFormData
  readonly setForm: Dispatch<SetStateAction<EditFormData>>
  readonly member: TeamStaff
  readonly teams: readonly TeamOption[]
}

export const TeamStaffEditFields = ({ form, setForm, member, teams }: Props): ReactNode => (
  <>
    <div className="grid grid-cols-2 gap-2">
      <FormField
        id="e-fn"
        label="Nombre"
        required
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />
      <FormField
        id="e-ln"
        label="Apellido"
        required
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />
    </div>
    <TeamSelectField
      id="e-tm"
      label="Escudería"
      required
      teams={teams}
      value={form.teamId}
      onChange={(e) => setForm({ ...form, teamId: e.target.value })}
    />
    <FormField
      id="e-rt"
      label="Cargo en la escudería"
      required
      value={form.roleInTeam}
      onChange={(e) => setForm({ ...form, roleInTeam: e.target.value })}
    />
    <FormField
      id="e-ph"
      label="Teléfono"
      required
      value={form.phoneNumber}
      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
    />
    <div className="grid grid-cols-2 gap-2">
      <FormField id="e-em" label="Correo electrónico (inmutable)" disabled value={member.email} />
      <FormField id="e-fl" label="Legajo (inmutable)" disabled value={member.fileNumber} />
    </div>
  </>
)
