import type { CreateTeamStaffBody, TeamOption } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TeamStaffCreateForm } from './team-staff-create-form'

type Props = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly teams: readonly TeamOption[]
  readonly onSubmit: (data: CreateTeamStaffBody) => Promise<void>
}

export const TeamStaffCreateDialog = ({
  open,
  onOpenChange,
  teams,
  onSubmit,
}: Props): ReactNode => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nuevo integrante de escudería</DialogTitle>
        <DialogDescription>Completá los datos para dar de alta la cuenta.</DialogDescription>
      </DialogHeader>
      <TeamStaffCreateForm
        teams={teams}
        onCancel={() => onOpenChange(false)}
        onSubmit={async (data) => {
          await onSubmit(data)
          onOpenChange(false)
        }}
      />
    </DialogContent>
  </Dialog>
)
