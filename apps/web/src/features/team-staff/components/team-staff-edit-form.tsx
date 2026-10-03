import type { TeamOption, TeamStaff, UpdateTeamStaffBody } from '@fia/shared/contracts'
import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { type EditFormData, TeamStaffEditFields } from './team-staff-edit-fields'

type Props = {
  readonly member: TeamStaff
  readonly teams: readonly TeamOption[]
  readonly onCancel: () => void
  readonly onSubmit: (id: string, body: UpdateTeamStaffBody) => Promise<void>
}

const toFormData = (m: TeamStaff): EditFormData => ({
  firstName: m.firstName,
  lastName: m.lastName,
  teamId: m.teamId,
  roleInTeam: m.roleInTeam,
  phoneNumber: m.phoneNumber,
})

export const TeamStaffEditForm = ({ member, teams, onCancel, onSubmit }: Props): ReactNode => {
  const [form, setForm] = useState<EditFormData>(() => toFormData(member))
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm(toFormData(member))
  }, [member])

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit(member.id, { ...form, version: member.version })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el personal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <TeamStaffEditFields form={form} setForm={setForm} member={member} teams={teams} />
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="accent" className="shadow-brutal-sm" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </form>
  )
}
