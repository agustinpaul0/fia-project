import type { CreatePenaltyBody, CreatePenaltyInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS, LABEL_CLASS } from '@/features/team-staff/components/field-message'
import { useTeamOptions } from '@/features/teams/hooks/use-team-options'

type Props = {
  readonly form: UseFormReturn<CreatePenaltyInput, unknown, CreatePenaltyBody>
}

export const PenaltyFormFields = ({ form }: Props): ReactNode => {
  const { data: teams = [] } = useTeamOptions()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="flex flex-col gap-3">
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
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className={LABEL_CLASS}>
            Tipo de sanción
          </label>
          <select id="type" {...register('type')} className={FIELD_CLASS}>
            <option value="time_penalty">Recargo de tiempo</option>
            <option value="grid_penalty">Puestos en grilla</option>
            <option value="points_deduction">Quita de puntos</option>
            <option value="disqualification">Descalificación</option>
            <option value="fine">Multa económica</option>
            <option value="reprimand">Apercibimiento</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="penalty" className={LABEL_CLASS}>
            Sanción aplicada
          </label>
          <input
            id="penalty"
            {...register('penalty')}
            placeholder="Ej: 5 segundos de recargo"
            className={FIELD_CLASS}
          />
          {errors.penalty && (
            <span className="text-secondary text-xs">{errors.penalty.message}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="reason" className={LABEL_CLASS}>
          Motivo / Justificación
        </label>
        <textarea
          id="reason"
          rows={3}
          {...register('reason')}
          placeholder="Descripción detallada de la infracción o incidente..."
          className={FIELD_CLASS}
        />
        {errors.reason && <span className="text-secondary text-xs">{errors.reason.message}</span>}
      </div>
    </div>
  )
}
