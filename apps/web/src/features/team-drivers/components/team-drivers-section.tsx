import type { Driver } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { QueryView } from '@/components/common/query-view'
import { Button } from '@/components/ui/button'
import { useCreateTeamDriver } from '../hooks/use-create-team-driver'
import { useTeamDrivers } from '../hooks/use-team-drivers'
import { useUpdateTeamDriver } from '../hooks/use-update-team-driver'
import { TeamDriverCreateDialog } from './team-driver-create-dialog'
import { TeamDriverEditDialog } from './team-driver-edit-dialog'
import { TeamDriversTable } from './team-drivers-table'

export const TeamDriversSection = (): ReactNode => {
  const query = useTeamDrivers()
  const createMut = useCreateTeamDriver()
  const updateMut = useUpdateTeamDriver()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Driver | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col justify-between gap-4 border-2 border-black bg-surface p-6 shadow-brutal sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold font-headline text-2xl text-on-surface uppercase tracking-wide">
            Pilotos de la Escudería
          </h1>
          <p className="font-mono text-on-surface-variant text-sm">
            Gestión y nómina oficial de pilotos titulares y suplentes inscriptos.
          </p>
        </div>
        <Button variant="accent" className="shadow-brutal-sm" onClick={() => setOpen(true)}>
          + Inscribir piloto
        </Button>
      </div>

      <QueryView
        query={query}
        isEmpty={(items) => items.length === 0}
        emptyMessage="No hay pilotos inscriptos en tu escudería."
      >
        {(drivers) => <TeamDriversTable drivers={drivers} onEdit={setEditing} />}
      </QueryView>

      <TeamDriverCreateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => {
          await createMut.mutateAsync(data)
          toast.success('Piloto inscripto exitosamente.')
        }}
      />

      <TeamDriverEditDialog
        driver={editing}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditing(null)
          }
        }}
        onSubmit={async (id, body) => {
          await updateMut.mutateAsync({ id, body })
          toast.success('Piloto actualizado exitosamente.')
        }}
      />
    </div>
  )
}
