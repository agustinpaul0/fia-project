import type { CreatePenaltyBody, CreatePenaltyInput } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FIELD_CLASS, LABEL_CLASS } from '@/features/team-staff/components/field-message'
import { useTeamRaces } from '@/features/teams/hooks/use-team-races'
import { argentinaInputToUtcIso } from '@/lib/argentina-date-input'
import { formatDate } from '@/lib/format-date-time'

type Props = {
  readonly form: UseFormReturn<CreatePenaltyInput, unknown, CreatePenaltyBody>
}

const toIssuedAt = (value: string): string | undefined =>
  value === '' ? undefined : argentinaInputToUtcIso(value)

const toNullable = (value: string): string | null => (value === '' ? null : value)

const seasonOf = (issuedAt: string | undefined): number =>
  (issuedAt ? new Date(issuedAt) : new Date()).getFullYear()

export const PenaltyWhenFields = ({ form }: Props): ReactNode => {
  const season = seasonOf(form.watch('issuedAt'))
  const { data: races = [] } = useTeamRaces(form.watch('teamId'), season)
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="issuedAt" className={LABEL_CLASS}>
          Fecha de la sanción
        </label>
        <input
          id="issuedAt"
          type="datetime-local"
          {...form.register('issuedAt', { setValueAs: toIssuedAt })}
          className={FIELD_CLASS}
        />
        <span className="text-on-surface-variant text-xs">
          Si queda vacía, se usa la fecha actual.
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="raceId" className={LABEL_CLASS}>
          Carrera
        </label>
        <select
          id="raceId"
          {...form.register('raceId', { setValueAs: toNullable })}
          className={FIELD_CLASS}
        >
          <option value="">Sin carrera asociada</option>
          {races.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({formatDate(r.date)})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
