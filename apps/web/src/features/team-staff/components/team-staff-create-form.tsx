import type { CreateTeamStaffBody, TeamOption } from '@fia/shared/contracts'
import { type FormEvent, type ReactNode, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { TeamStaffCreateFields } from './team-staff-create-fields'

type Props = {
  readonly teams: readonly TeamOption[]
  readonly onCancel: () => void
  readonly onSubmit: (data: CreateTeamStaffBody) => Promise<void>
}

const INITIAL: CreateTeamStaffBody = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  teamId: '',
  roleInTeam: '',
  phoneNumber: '',
  fileNumber: '',
}

export const TeamStaffCreateForm = ({ teams, onCancel, onSubmit }: Props): ReactNode => {
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await onSubmit(form)
      setForm(INITIAL)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el personal')
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
      <TeamStaffCreateFields form={form} setForm={setForm} teams={teams} />
      <p className="text-xs text-muted-foreground">
        Nota: Las credenciales deben entregarse de manera externa y segura al integrante.
      </p>
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear cuenta'}
        </Button>
      </DialogFooter>
    </form>
  )
}
