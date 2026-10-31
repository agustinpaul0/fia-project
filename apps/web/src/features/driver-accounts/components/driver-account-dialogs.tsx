import type {
  CreateDriverAccountBody,
  Driver,
  DriverAccount,
  UpdateDriverAccountBody,
} from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DriverAccountCreateForm } from './driver-account-create-form'
import { DriverAccountEditForm } from './driver-account-edit-form'

type CreateProps = {
  readonly open: boolean
  readonly drivers: readonly Driver[]
  readonly onOpenChange: (open: boolean) => void
  readonly onSubmit: (body: CreateDriverAccountBody) => Promise<void>
}

export const DriverAccountCreateDialog = (p: CreateProps): ReactNode => (
  <Dialog open={p.open} onOpenChange={p.onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nueva cuenta oficial de piloto</DialogTitle>
        <DialogDescription>
          La cuenta queda asociada al piloto y marcada como oficial. Vos definís la contraseña
          inicial.
        </DialogDescription>
      </DialogHeader>
      <DriverAccountCreateForm
        drivers={p.drivers}
        onCancel={() => p.onOpenChange(false)}
        onSubmit={async (body) => {
          await p.onSubmit(body)
          p.onOpenChange(false)
        }}
      />
    </DialogContent>
  </Dialog>
)

type EditProps = {
  readonly account: DriverAccount | null
  readonly onClose: () => void
  readonly onSubmit: (id: string, body: UpdateDriverAccountBody) => Promise<void>
}

export const DriverAccountEditDialog = ({ account, onClose, onSubmit }: EditProps): ReactNode => (
  <Dialog open={account !== null} onOpenChange={(open) => (open ? undefined : onClose())}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Modificar cuenta de piloto</DialogTitle>
        <DialogDescription>{account?.driverName}</DialogDescription>
      </DialogHeader>
      {account ? (
        <DriverAccountEditForm
          account={account}
          onCancel={onClose}
          onSubmit={async (id, body) => {
            await onSubmit(id, body)
            onClose()
          }}
        />
      ) : null}
    </DialogContent>
  </Dialog>
)
