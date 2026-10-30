import type { Driver, UpdateTeamDriverBody } from '@fia/shared/contracts'
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
  readonly driver: Driver | null
  readonly onOpenChange: (open: boolean) => void
  readonly onSubmit: (id: string, body: UpdateTeamDriverBody) => Promise<void>
}

export const TeamDriverEditDialog = ({ driver, onOpenChange, onSubmit }: Props): ReactNode => (
  <Dialog open={driver !== null} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar piloto</DialogTitle>
        <DialogDescription>
          Modificá la información oficial o la condición de titular o suplente del piloto.
        </DialogDescription>
      </DialogHeader>
      {driver ? (
        <TeamDriverCreateForm
          initialValues={{
            firstName: driver.firstName,
            lastName: driver.lastName,
            code: driver.code,
            number: driver.number,
            country: driver.country,
            license: driver.license ?? '',
            role: driver.role,
          }}
          submitLabel="Guardar cambios"
          onCancel={() => onOpenChange(false)}
          onSubmit={async (data) => {
            await onSubmit(driver.id, { ...data, version: driver.version })
            onOpenChange(false)
          }}
        />
      ) : null}
    </DialogContent>
  </Dialog>
)
