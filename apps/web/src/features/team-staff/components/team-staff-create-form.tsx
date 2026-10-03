import type { CreateTeamStaffBody, TeamOption } from '@fia/shared/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { applyServerErrors } from '@/lib/form-errors'
import {
  CREATE_FIELDS,
  type CreateInput,
  createStaffFormSchema,
  EMPTY_CREATE,
} from '../staff-form-schemas'
import { TeamStaffCreateFields } from './team-staff-create-fields'

type Props = {
  readonly teams: readonly TeamOption[]
  readonly onCancel: () => void
  readonly onSubmit: (data: CreateTeamStaffBody) => Promise<void>
}

export const TeamStaffCreateForm = ({ teams, onCancel, onSubmit }: Props): ReactNode => {
  const form = useForm<CreateInput, unknown, CreateTeamStaffBody>({
    resolver: zodResolver(createStaffFormSchema),
    defaultValues: EMPTY_CREATE,
  })
  const [error, setError] = useState<string | null>(null)
  const submit = form.handleSubmit(async (data) => {
    setError(null)
    try {
      await onSubmit(data)
      form.reset(EMPTY_CREATE)
    } catch (err) {
      const fallback = 'Error al crear el personal'
      setError(applyServerErrors(form.setError, { error: err, fallback, names: CREATE_FIELDS }))
    }
  })
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <TeamStaffCreateFields form={form} teams={teams} />
      <p className="text-on-surface-variant text-xs">
        Nota: Las credenciales deben entregarse de manera externa y segura al integrante.
      </p>
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
          {form.formState.isSubmitting ? 'Guardando...' : 'Crear cuenta'}
        </Button>
      </DialogFooter>
    </form>
  )
}
