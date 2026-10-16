import {
  type CreateTeamDriverBody,
  type CreateTeamDriverInput,
  createTeamDriverBodySchema,
} from '@fia/shared/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { TeamDriverFormFields } from './team-driver-form-fields'

type Props = {
  readonly onCancel: () => void
  readonly onSubmit: (data: CreateTeamDriverBody) => Promise<void>
}

const EMPTY: CreateTeamDriverInput = {
  firstName: '',
  lastName: '',
  code: '',
  number: 1,
  country: '',
  license: '',
  role: 'main',
}

export const TeamDriverCreateForm = ({ onCancel, onSubmit }: Props): ReactNode => {
  const form = useForm<CreateTeamDriverInput, unknown, CreateTeamDriverBody>({
    resolver: zodResolver(createTeamDriverBodySchema),
    defaultValues: EMPTY,
  })
  const [error, setError] = useState<string | null>(null)

  const submit = form.handleSubmit(async (data) => {
    setError(null)
    try {
      await onSubmit(data)
      form.reset(EMPTY)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al inscribir el piloto'
      setError(msg)
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <TeamDriverFormFields form={form} />
      <DialogFooter className="mt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="accent"
          className="shadow-brutal-sm"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Inscribiendo...' : 'Inscribir piloto'}
        </Button>
      </DialogFooter>
    </form>
  )
}
