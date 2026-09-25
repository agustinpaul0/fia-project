import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffSectionDialogs } from './team-staff-section-dialogs'

describe('TeamStaffSectionDialogs', () => {
  it('renderiza diálogos abiertos y dispara callbacks', () => {
    const member = aTeamStaffMember()
    const teams = [{ id: member.teamId, name: 'Ferrari' }]
    const onCreate = vi.fn()
    const onUpdate = vi.fn()
    const onDeactivate = vi.fn()
    const setCreate = vi.fn()
    const setEdit = vi.fn()
    const setDeact = vi.fn()

    render(
      <TeamStaffSectionDialogs
        createOpen={true}
        setCreateOpen={setCreate}
        editingMember={member}
        setEditingMember={setEdit}
        deactivatingMember={member}
        setDeactivatingMember={setDeact}
        teams={teams}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDeactivate={onDeactivate}
      />,
    )

    expect(screen.getByText('Nuevo integrante de escudería')).toBeInTheDocument()
  })
})
