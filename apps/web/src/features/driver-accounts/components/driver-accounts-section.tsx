import type { DriverAccount } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { QueryView } from '@/components/common/query-view'
import { Button } from '@/components/ui/button'
import { usePublicDrivers } from '@/features/team-drivers/hooks/use-public-drivers'
import {
  useCreateDriverAccount,
  useDeactivateDriverAccount,
  useDriverAccounts,
  useUpdateDriverAccount,
} from '../hooks/use-driver-accounts'
import { DriverAccountDeactivateDialog } from './driver-account-deactivate-dialog'
import { DriverAccountCreateDialog, DriverAccountEditDialog } from './driver-account-dialogs'
import { DriverAccountsTable } from './driver-accounts-table'

export const DriverAccountsSection = (): ReactNode => {
  const query = useDriverAccounts()
  const drivers = usePublicDrivers().data ?? []
  const createMut = useCreateDriverAccount()
  const updateMut = useUpdateDriverAccount()
  const deactivateMut = useDeactivateDriverAccount()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<DriverAccount | null>(null)
  const [removing, setRemoving] = useState<DriverAccount | null>(null)
  const withAccount = new Set((query.data ?? []).map((a) => a.driverId))
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col justify-between gap-4 border-2 border-black bg-surface p-6 shadow-brutal sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold font-headline text-2xl uppercase">Cuentas de pilotos</h1>
          <p className="font-mono text-on-surface-variant text-sm">
            Usuarios oficiales de los pilotos registrados por las escuderías.
          </p>
        </div>
        <Button variant="accent" onClick={() => setCreating(true)}>
          + Nueva cuenta
        </Button>
      </div>
      <QueryView
        query={query}
        isEmpty={(a) => a.length === 0}
        emptyMessage="Todavía no hay cuentas de pilotos."
      >
        {(accounts) => (
          <DriverAccountsTable accounts={accounts} onEdit={setEditing} onDeactivate={setRemoving} />
        )}
      </QueryView>
      <DriverAccountCreateDialog
        open={creating}
        onOpenChange={setCreating}
        drivers={drivers.filter((d) => !withAccount.has(d.id))}
        onSubmit={async (body) => {
          await createMut.mutateAsync(body)
          toast.success('Cuenta oficial del piloto creada.')
        }}
      />
      <DriverAccountEditDialog
        account={editing}
        onClose={() => setEditing(null)}
        onSubmit={async (id, body) => {
          await updateMut.mutateAsync({ id, body })
          toast.success('Cuenta del piloto actualizada.')
        }}
      />
      <DriverAccountDeactivateDialog
        account={removing}
        onClose={() => setRemoving(null)}
        onConfirm={async ({ id, version }) => {
          await deactivateMut.mutateAsync({ id, version })
          toast.success('Cuenta del piloto dada de baja.')
        }}
      />
    </div>
  )
}
