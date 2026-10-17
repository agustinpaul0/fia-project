import type { CreateTeamDriverBody } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TeamDriverCreateForm } from './team-driver-create-form'

type Props = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onSubmit: (data: CreateTeamDriverBody) => Promise<void>
}

export const TeamDriverCreateDialog = ({ open, onOpenChange, onSubmit }: Props): ReactNode => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Inscribir nuevo piloto</DialogTitle>
        <DialogDescription>
          Completá los datos oficiales para registrar el piloto en la nómina de tu escudería.
        </DialogDescription>
      </DialogHeader>
      <TeamDriverCreateForm
        onCancel={() => onOpenChange(false)}
        onSubmit={async (data) => {
          await onSubmit(data)
          onOpenChange(false)
        }}
      />
    </DialogContent>
  </Dialog>
)
