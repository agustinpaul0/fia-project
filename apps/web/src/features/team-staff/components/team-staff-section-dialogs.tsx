import type {
  CreateTeamStaffBody,
  TeamOption,
  TeamStaff,
  UpdateTeamStaffBody,
} from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { TeamStaffCreateDialog } from './team-staff-create-dialog'
import { TeamStaffDeactivateDialog } from './team-staff-deactivate-dialog'
import { TeamStaffEditDialog } from './team-staff-edit-dialog'

type Props = {
  readonly createOpen: boolean
  readonly setCreateOpen: (open: boolean) => void
  readonly editingMember: TeamStaff | null
  readonly setEditingMember: (member: TeamStaff | null) => void
  readonly deactivatingMember: TeamStaff | null
  readonly setDeactivatingMember: (member: TeamStaff | null) => void
  readonly teams: readonly TeamOption[]
  readonly onCreate: (body: CreateTeamStaffBody) => Promise<void>
  readonly onUpdate: (id: string, body: UpdateTeamStaffBody) => Promise<void>
  readonly onDeactivate: (id: string, version: number) => Promise<void>
}

export const TeamStaffSectionDialogs = (props: Props): ReactNode => (
  <>
    <TeamStaffCreateDialog
      open={props.createOpen}
      onOpenChange={props.setCreateOpen}
      teams={props.teams}
      onSubmit={props.onCreate}
    />
    <TeamStaffEditDialog
      member={props.editingMember}
      onOpenChange={(open) => !open && props.setEditingMember(null)}
      teams={props.teams}
      onSubmit={props.onUpdate}
    />
    <TeamStaffDeactivateDialog
      member={props.deactivatingMember}
      onOpenChange={(open) => !open && props.setDeactivatingMember(null)}
      onConfirm={props.onDeactivate}
    />
  </>
)
