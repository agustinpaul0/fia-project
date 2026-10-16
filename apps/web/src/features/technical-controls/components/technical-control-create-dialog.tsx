import type { CreateTechnicalControlBody } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TechnicalControlCreateForm } from './technical-control-create-form'

type Props = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onSubmit: (data: CreateTechnicalControlBody) => Promise<void>
}

export const TechnicalControlCreateDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: Props): ReactNode => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Registrar nuevo control técnico</DialogTitle>
        <DialogDescription>
          Ingresá los datos del control técnico reglamentario realizado al vehículo y su dictamen
          final.
        </DialogDescription>
      </DialogHeader>
      <TechnicalControlCreateForm
        onCancel={() => onOpenChange(false)}
        onSubmit={async (data) => {
          await onSubmit(data)
          onOpenChange(false)
        }}
      />
    </DialogContent>
  </Dialog>
)
