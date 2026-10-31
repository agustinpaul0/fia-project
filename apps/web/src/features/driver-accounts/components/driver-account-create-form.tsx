import {
  type CreateDriverAccountBody,
  type CreateDriverAccountInput,
  createDriverAccountBodySchema,
  type Driver,
} from '@fia/shared/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  FIELD_CLASS,
  FieldMessage,
  LABEL_CLASS,
} from '@/features/team-staff/components/field-message'
import { FormField } from '@/features/team-staff/components/form-field'
import { applyServerErrors } from '@/lib/form-errors'

type Props = {
  readonly drivers: readonly Driver[]
  readonly onCancel: () => void
  readonly onSubmit: (body: CreateDriverAccountBody) => Promise<void>
}

const FIELDS = ['driverId', 'name', 'email', 'password'] as const

export const DriverAccountCreateForm = ({ drivers, onCancel, onSubmit }: Props): ReactNode => {
  const form = useForm<CreateDriverAccountInput, unknown, CreateDriverAccountBody>({
    resolver: zodResolver(createDriverAccountBodySchema),
    defaultValues: { driverId: '', name: '', email: '', password: '' },
  })
  const [error, setError] = useState<string | null>(null)
  const errors = form.formState.errors
  const submit = form.handleSubmit(async (data) => {
    setError(null)
    try {
      await onSubmit(data)
    } catch (err) {
      const fallback = 'No se pudo crear la cuenta del piloto.'
      setError(applyServerErrors(form.setError, { error: err, fallback, names: FIELDS }))
    }
  })
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="driverId" className={LABEL_CLASS}>
          Piloto
        </label>
        <select id="driverId" className={FIELD_CLASS} {...form.register('driverId')}>
          <option value="">Elegí un piloto sin cuenta</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>{`${d.firstName} ${d.lastName} (${d.code})`}</option>
          ))}
        </select>
        <FieldMessage id="driverId" error={errors.driverId?.message} hint={undefined} />
      </div>
      <FormField
        id="name"
        label="Nombre visible"
        error={errors.name?.message}
        {...form.register('name')}
      />
      <FormField
        id="email"
        type="email"
        label="Email"
        error={errors.email?.message}
        {...form.register('email')}
      />
      <FormField
        id="password"
        type="password"
        label="Contraseña inicial"
        error={errors.password?.message}
        {...form.register('password')}
      />
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creando...' : 'Crear cuenta'}
        </Button>
      </DialogFooter>
    </form>
  )
}
