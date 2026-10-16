import {
  type CreateTechnicalControlBody,
  type CreateTechnicalControlInput,
  createTechnicalControlBodySchema,
} from '@fia/shared/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { TechnicalControlFormFields } from './technical-control-form-fields'

type Props = {
  readonly onCancel: () => void
  readonly onSubmit: (data: CreateTechnicalControlBody) => Promise<void>
}

const EMPTY: CreateTechnicalControlInput = {
  teamId: '',
  driverId: null,
  carNumber: Number.NaN,
  raceId: null,
  controlType: 'weight',
  status: 'passed',
  notes: '',
  inspectedAt: '',
  expiresAt: '',
}

export const TechnicalControlCreateForm = ({ onCancel, onSubmit }: Props): ReactNode => {
  const [error, setError] = useState<string | null>(null)
  const form = useForm<CreateTechnicalControlInput, unknown, CreateTechnicalControlBody>({
    resolver: zodResolver(createTechnicalControlBodySchema),
    defaultValues: EMPTY,
  })

  const submit = form.handleSubmit(async (data) => {
    setError(null)
    try {
      await onSubmit(data)
      form.reset(EMPTY)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el control técnico')
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <TechnicalControlFormFields form={form} />
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
          {form.formState.isSubmitting ? 'Registrando...' : 'Registrar control'}
        </Button>
      </DialogFooter>
    </form>
  )
}
