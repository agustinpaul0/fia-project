import type { TeamOption } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly teams: readonly TeamOption[]
  readonly selectedTeamId: string
  readonly onTeamChange: (teamId: string) => void
}

export const PenaltiesTeamFilter = ({ teams, selectedTeamId, onTeamChange }: Props): ReactNode => (
  <div className="flex items-center gap-2">
    <label htmlFor="filter-team" className="font-bold font-mono text-xs uppercase">
      Escudería:
    </label>
    <select
      id="filter-team"
      value={selectedTeamId}
      onChange={(e) => onTeamChange(e.target.value)}
      className={`${FIELD_CLASS} w-auto font-mono text-xs`}
    >
      <option value="">Todas</option>
      {teams.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  </div>
)
