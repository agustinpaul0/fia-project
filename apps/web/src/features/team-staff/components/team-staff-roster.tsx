import type { TeamOption, TeamStaff } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { EMPTY_FILTER, filterStaff } from '../staff-roster'
import { TeamStaffFilters } from './team-staff-filters'
import { TeamStaffTable } from './team-staff-table'

type Props = {
  readonly members: readonly TeamStaff[]
  readonly teams: readonly TeamOption[]
  readonly onEdit: (member: TeamStaff) => void
  readonly onDeactivate: (member: TeamStaff) => void
}

export const TeamStaffRoster = ({ members, teams, onEdit, onDeactivate }: Props): ReactNode => {
  const [filter, setFilter] = useState(EMPTY_FILTER)
  return (
    <>
      <TeamStaffFilters filter={filter} teams={teams} onChange={setFilter} />
      <TeamStaffTable
        members={filterStaff(members, filter)}
        total={members.length}
        onEdit={onEdit}
        onDeactivate={onDeactivate}
      />
    </>
  )
}
