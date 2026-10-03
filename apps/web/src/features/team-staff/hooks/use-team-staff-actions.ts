import type { CreateTeamStaffBody, UpdateTeamStaffBody } from '@fia/shared/contracts'
import { toast } from 'sonner'
import { useCreateTeamStaff } from './use-create-team-staff'
import { useDeactivateTeamStaff } from './use-deactivate-team-staff'
import { useUpdateTeamStaff } from './use-update-team-staff'

export type TeamStaffActions = {
  readonly onCreate: (body: CreateTeamStaffBody) => Promise<void>
  readonly onUpdate: (id: string, body: UpdateTeamStaffBody) => Promise<void>
  readonly onDeactivate: (id: string, version: number) => Promise<void>
}

export const useTeamStaffActions = (): TeamStaffActions => {
  const createMut = useCreateTeamStaff()
  const updateMut = useUpdateTeamStaff()
  const deactMut = useDeactivateTeamStaff()
  return {
    onCreate: async (body) => {
      await createMut.mutateAsync(body)
      toast.success('Cuenta creada exitosamente')
    },
    onUpdate: async (id, body) => {
      await updateMut.mutateAsync({ id, body })
      toast.success('Datos actualizados exitosamente')
    },
    onDeactivate: async (id, version) => {
      await deactMut.mutateAsync({ id, version })
      toast.success('Cuenta dada de baja exitosamente')
    },
  }
}
