import type { CreatePenaltyBody } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PenaltyCreateForm } from './penalty-create-form'

type Props = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onSubmit: (data: CreatePenaltyBody) => Promise<void>
}

export const PenaltyCreateDialog = ({ open, onOpenChange, onSubmit }: Props): ReactNode => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Registrar nueva sanción</DialogTitle>
        <DialogDescription>
          Ingresá la sanción disciplinaria o técnica oficial aplicada a una escudería o piloto.
        </DialogDescription>
      </DialogHeader>
      <PenaltyCreateForm
        onCancel={() => onOpenChange(false)}
        onSubmit={async (data) => {
          await onSubmit(data)
          onOpenChange(false)
        }}
      />
    </DialogContent>
  </Dialog>
)
