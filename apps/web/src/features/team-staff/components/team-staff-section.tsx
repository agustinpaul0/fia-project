import type { TeamStaff } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useTeamOptions } from '../../teams/hooks/use-team-options'
import { useTeamStaff } from '../hooks/use-team-staff'
import { useTeamStaffActions } from '../hooks/use-team-staff-actions'
import { staffStats } from '../staff-roster'
import { TeamStaffHero } from './team-staff-hero'
import { TeamStaffRoster } from './team-staff-roster'
import { TeamStaffSectionDialogs } from './team-staff-section-dialogs'

export const TeamStaffSection = (): ReactNode => {
  const staffQuery = useTeamStaff()
  const teamsQuery = useTeamOptions()
  const actions = useTeamStaffActions()
  const [createOpen, setCreateOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamStaff | null>(null)
  const [deactivatingMember, setDeactivatingMember] = useState<TeamStaff | null>(null)
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <TeamStaffHero
        stats={staffQuery.data === undefined ? null : staffStats(staffQuery.data)}
        onCreate={() => setCreateOpen(true)}
      />
      <QueryView
        query={staffQuery}
        isEmpty={(items) => items.length === 0}
        emptyMessage="Todavía no hay personal de escuderías cargado."
      >
        {(items) => (
          <TeamStaffRoster
            members={items}
            teams={teamsQuery.data ?? []}
            onEdit={setEditingMember}
            onDeactivate={setDeactivatingMember}
          />
        )}
      </QueryView>
      <TeamStaffSectionDialogs
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        editingMember={editingMember}
        setEditingMember={setEditingMember}
        deactivatingMember={deactivatingMember}
        setDeactivatingMember={setDeactivatingMember}
        teams={teamsQuery.data ?? []}
        {...actions}
      />
    </div>
  )
}
