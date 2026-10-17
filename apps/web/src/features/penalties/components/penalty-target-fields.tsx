import type { CreatePenaltyBody, CreatePenaltyInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS, LABEL_CLASS } from '@/features/team-staff/components/field-message'
import { useDriverOptions } from '@/features/teams/hooks/use-driver-options'
import { useTeamOptions } from '@/features/teams/hooks/use-team-options'

type Props = {
  readonly form: UseFormReturn<CreatePenaltyInput, unknown, CreatePenaltyBody>
}

const toNullable = (value: string): string | null => (value === '' ? null : value)

export const PenaltyTargetFields = ({ form }: Props): ReactNode => {
  const { data: teams = [] } = useTeamOptions()
  const { data: drivers = [] } = useDriverOptions(form.watch('teamId'))
  const { errors } = form.formState
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="teamId" className={LABEL_CLASS}>
          Escudería
        </label>
        <select id="teamId" {...form.register('teamId')} className={FIELD_CLASS}>
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
        <label htmlFor="driverId" className={LABEL_CLASS}>
          Piloto
        </label>
        <select
          id="driverId"
          {...form.register('driverId', { setValueAs: toNullable })}
          className={FIELD_CLASS}
        >
          <option value="">Toda la escudería</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
