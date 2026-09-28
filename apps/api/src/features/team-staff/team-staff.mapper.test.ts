import type { TeamStaffRow } from '@fia/shared/db'
import { describe, expect, it } from 'vitest'
import { toTeamStaffDto } from './team-staff.mapper'

describe('toTeamStaffDto', () => {
  const row: TeamStaffRow = {
    id: '00000000-0000-4000-8000-000000000001',
    userId: 'user-1',
    teamId: '00000000-0000-4000-8000-000000000010',
    firstName: 'Charles',
    lastName: 'Leclerc',
    roleInTeam: 'Jefe de Mecánicos',
    phoneNumber: '+54 9 291 1234567',
    fileNumber: 'LEG-1234',
    isActive: true,
    deactivatedAt: null,
    deactivatedBy: null,
    version: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  }

  it('mapea correctamente una fila activa a DTO', () => {
    const dto = toTeamStaffDto({
      staff: row,
      userEmail: 'charles@ferrari.com',
      teamName: 'Ferrari',
    })
    expect(dto).toEqual({
      id: row.id,
      userId: row.userId,
      teamId: row.teamId,
      teamName: 'Ferrari',
      firstName: row.firstName,
      lastName: row.lastName,
      email: 'charles@ferrari.com',
      roleInTeam: row.roleInTeam,
      phoneNumber: row.phoneNumber,
      fileNumber: row.fileNumber,
      isActive: true,
      deactivatedAt: null,
      version: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })
  })

  it('mapea fecha de baja cuando la cuenta está inactiva', () => {
    const inactiveRow: TeamStaffRow = {
      ...row,
      isActive: false,
      deactivatedAt: new Date('2026-02-01T12:00:00.000Z'),
      deactivatedBy: 'admin-1',
    }
    const dto = toTeamStaffDto({
      staff: inactiveRow,
      userEmail: 'charles@ferrari.com',
      teamName: 'Ferrari',
    })
    expect(dto.isActive).toBe(false)
    expect(dto.deactivatedAt).toBe('2026-02-01T12:00:00.000Z')
  })
})
