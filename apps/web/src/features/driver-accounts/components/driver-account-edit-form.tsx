import {
  type DriverAccount,
  type UpdateDriverAccountBody,
  updateDriverAccountBodySchema,
} from '@fia/shared/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormField } from '@/features/team-staff/components/form-field'
import { applyServerErrors } from '@/lib/form-errors'

type Props = {
  readonly account: DriverAccount
  readonly onCancel: () => void
  readonly onSubmit: (id: string, body: UpdateDriverAccountBody) => Promise<void>
}

export const DriverAccountEditForm = ({ account, onCancel, onSubmit }: Props): ReactNode => {
  const form = useForm<UpdateDriverAccountBody>({
    resolver: zodResolver(updateDriverAccountBodySchema),
    defaultValues: { name: account.name, version: account.version },
  })
  const [error, setError] = useState<string | null>(null)
  const submit = form.handleSubmit(async (data) => {
    setError(null)
    try {
      await onSubmit(account.id, data)
    } catch (err) {
      const fallback = 'No se pudo modificar la cuenta del piloto.'
      setError(applyServerErrors(form.setError, { error: err, fallback, names: ['name'] }))
    }
  })
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <FormField
        id="edit-name"
        label="Nombre visible"
        error={form.formState.errors.name?.message}
        {...form.register('name')}
      />
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </form>
  )
}
