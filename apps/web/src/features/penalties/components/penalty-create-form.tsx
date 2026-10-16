import {
  type CreatePenaltyBody,
  type CreatePenaltyInput,
  createPenaltyBodySchema,
} from '@fia/shared/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { PenaltyFormFields } from './penalty-form-fields'

type Props = {
  readonly onCancel: () => void
  readonly onSubmit: (data: CreatePenaltyBody) => Promise<void>
}

const EMPTY: CreatePenaltyInput = {
  teamId: '',
  driverId: null,
  raceId: null,
  type: 'time_penalty',
  penalty: '',
  reason: '',
}

export const PenaltyCreateForm = ({ onCancel, onSubmit }: Props): ReactNode => {
  const [error, setError] = useState<string | null>(null)
  const form = useForm<CreatePenaltyInput, unknown, CreatePenaltyBody>({
    resolver: zodResolver(createPenaltyBodySchema),
    defaultValues: EMPTY,
  })

  const submit = form.handleSubmit(async (data) => {
    setError(null)
    try {
      await onSubmit(data)
      form.reset(EMPTY)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar la sanción')
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <PenaltyFormFields form={form} />
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
          {form.formState.isSubmitting ? 'Registrando...' : 'Registrar sanción'}
        </Button>
      </DialogFooter>
    </form>
  )
}
