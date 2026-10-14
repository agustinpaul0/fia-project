import type { CreateTechnicalControlBody, CreateTechnicalControlInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS, LABEL_CLASS } from '@/features/team-staff/components/field-message'
import { useTeamOptions } from '@/features/teams/hooks/use-team-options'

type Props = {
  readonly form: UseFormReturn<CreateTechnicalControlInput, unknown, CreateTechnicalControlBody>
}

export const TechnicalControlFormFields = ({ form }: Props): ReactNode => {
  const { data: teams = [] } = useTeamOptions()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="teamId" className={LABEL_CLASS}>
            Escudería
          </label>
          <select id="teamId" {...register('teamId')} className={FIELD_CLASS}>
            <option value="">Seleccionar escudería...</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.teamId && <span className="text-secondary text-xs">{errors.teamId.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="carNumber" className={LABEL_CLASS}>
            Número de auto
          </label>
          <input
            id="carNumber"
            type="number"
            {...register('carNumber', { valueAsNumber: true })}
            placeholder="Ej: 16"
            className={FIELD_CLASS}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="controlType" className={LABEL_CLASS}>
            Tipo de control
          </label>
          <select id="controlType" {...register('controlType')} className={FIELD_CLASS}>
            <option value="weight">Pesaje</option>
            <option value="fuel">Combustible</option>
            <option value="dimensions">Dimensiones</option>
            <option value="engine">Motor y Potencia</option>
            <option value="safety">Seguridad</option>
            <option value="post_race">Post-Carrera</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className={LABEL_CLASS}>
            Dictamen
          </label>
          <select id="status" {...register('status')} className={FIELD_CLASS}>
            <option value="passed">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className={LABEL_CLASS}>
          Observaciones
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register('notes')}
          placeholder="Detalles de la inspección, lecturas o motivos en caso de rechazo..."
          className={FIELD_CLASS}
        />
      </div>
    </div>
  )
}
