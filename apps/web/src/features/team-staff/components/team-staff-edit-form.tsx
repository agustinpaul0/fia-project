import type { TeamOption, TeamStaff, UpdateTeamStaffBody } from '@fia/shared/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { applyServerErrors } from '@/lib/form-errors'
import {
  EDIT_FIELDS,
  type EditInput,
  type EditOutput,
  editStaffFormSchema,
} from '../staff-form-schemas'
import { TeamStaffEditFields } from './team-staff-edit-fields'

type Props = {
  readonly member: TeamStaff
  readonly teams: readonly TeamOption[]
  readonly onCancel: () => void
  readonly onSubmit: (id: string, body: UpdateTeamStaffBody) => Promise<void>
}

const toFormData = (m: TeamStaff): EditInput => ({
  firstName: m.firstName,
  lastName: m.lastName,
  teamId: m.teamId,
  roleInTeam: m.roleInTeam,
  phoneNumber: m.phoneNumber,
})

export const TeamStaffEditForm = ({ member, teams, onCancel, onSubmit }: Props): ReactNode => {
  const form = useForm<EditInput, unknown, EditOutput>({
    resolver: zodResolver(editStaffFormSchema),
    defaultValues: toFormData(member),
  })
  const [error, setError] = useState<string | null>(null)
  const { reset } = form
  useEffect(() => {
    reset(toFormData(member))
  }, [member, reset])
  const submit = form.handleSubmit(async (data) => {
    setError(null)
    try {
      await onSubmit(member.id, { ...data, version: member.version })
    } catch (err) {
      const fallback = 'Error al actualizar el personal'
      setError(applyServerErrors(form.setError, { error: err, fallback, names: EDIT_FIELDS }))
    }
  })
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <TeamStaffEditFields form={form} member={member} teams={teams} />
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="accent"
          className="shadow-brutal-sm"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </form>
  )
}
