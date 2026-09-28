import type { TeamStaff } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { QueryView } from '@/components/common/query-view'
import { Button } from '@/components/ui/button'
import { useTeamOptions } from '../../teams/hooks/use-team-options'
import { useCreateTeamStaff } from '../hooks/use-create-team-staff'
import { useDeactivateTeamStaff } from '../hooks/use-deactivate-team-staff'
import { useTeamStaff } from '../hooks/use-team-staff'
import { useUpdateTeamStaff } from '../hooks/use-update-team-staff'
import { TeamStaffSectionDialogs } from './team-staff-section-dialogs'
import { TeamStaffTable } from './team-staff-table'

export const TeamStaffSection = (): ReactNode => {
  const staffQuery = useTeamStaff()
  const teamsQuery = useTeamOptions()
  const createMut = useCreateTeamStaff()
  const updateMut = useUpdateTeamStaff()
  const deactMut = useDeactivateTeamStaff()

  const [createOpen, setCreateOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamStaff | null>(null)
  const [deactivatingMember, setDeactivatingMember] = useState<TeamStaff | null>(null)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Personal de escuderías</h2>
          <p className="text-sm text-muted-foreground">
            Gestión de cuentas para el personal de las escuderías participantes.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Nuevo integrante</Button>
      </div>

      <QueryView
        query={staffQuery}
        isEmpty={(items) => items.length === 0}
        emptyMessage="Todavía no hay personal de escuderías cargado."
      >
        {(items) => (
          <TeamStaffTable
            members={items}
            onEdit={setEditingMember}
            onDeactivate={setDeactivatingMember}
          />
        )}
      </QueryView>

      <TeamStaffSectionDialogs
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        editingMember={editingMember}
        setEditingMember={setEditingMember}
        deactivatingMember={deactivatingMember}
        setDeactivatingMember={setDeactivatingMember}
        teams={teamsQuery.data ?? []}
        onCreate={async (body) => {
          await createMut.mutateAsync(body)
          toast.success('Cuenta creada exitosamente')
        }}
        onUpdate={async (id, body) => {
          await updateMut.mutateAsync({ id, body })
          toast.success('Datos actualizados exitosamente')
        }}
        onDeactivate={async (id, version) => {
          await deactMut.mutateAsync({ id, version })
          toast.success('Cuenta dada de baja exitosamente')
        }}
      />
    </section>
  )
}
