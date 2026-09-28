import type { TeamOption, TeamStaff, UpdateTeamStaffBody } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TeamStaffEditForm } from './team-staff-edit-form'

type Props = {
  readonly member: TeamStaff | null
  readonly onOpenChange: (open: boolean) => void
  readonly teams: readonly TeamOption[]
  readonly onSubmit: (id: string, body: UpdateTeamStaffBody) => Promise<void>
}

export const TeamStaffEditDialog = ({
  member,
  onOpenChange,
  teams,
  onSubmit,
}: Props): ReactNode => (
  <Dialog open={member !== null} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar integrante</DialogTitle>
        <DialogDescription>Modificá los datos permitidos del integrante.</DialogDescription>
      </DialogHeader>
      {member && (
        <TeamStaffEditForm
          member={member}
          teams={teams}
          onCancel={() => onOpenChange(false)}
          onSubmit={async (id, body) => {
            await onSubmit(id, body)
            onOpenChange(false)
          }}
        />
      )}
    </DialogContent>
  </Dialog>
)
