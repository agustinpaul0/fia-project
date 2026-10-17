import type { Penalty, TeamOption } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { PenaltiesTable } from './penalties-table'
import { PenaltiesTeamFilter } from './penalties-team-filter'

const teamsOf = (penalties: readonly Penalty[]): readonly TeamOption[] => {
  const byId = new Map(penalties.map((p) => [p.teamId, { id: p.teamId, name: p.teamName }]))
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export const NO_TEAM_PENALTIES = 'La escudería elegida no tiene sanciones con estos filtros.'

export const PenaltiesList = ({
  penalties,
}: {
  readonly penalties: readonly Penalty[]
}): ReactNode => {
  const [teamId, setTeamId] = useState('')
  const visible = teamId === '' ? penalties : penalties.filter((p) => p.teamId === teamId)
  return (
    <div className="flex flex-col gap-3">
      <PenaltiesTeamFilter
        teams={teamsOf(penalties)}
        selectedTeamId={teamId}
        onTeamChange={setTeamId}
      />
      {visible.length === 0 ? (
        <p className="font-mono text-on-surface-variant text-sm">{NO_TEAM_PENALTIES}</p>
      ) : (
        <PenaltiesTable penalties={visible} />
      )}
    </div>
  )
}
