import type { CreateTeamStaffBody, TeamStaff } from '@fia/shared/contracts'
import type { CreateTeamStaffRecord } from '../features/team-staff/team-staff.port'

export const buildTeamStaffDto = (overrides?: Partial<TeamStaff>): TeamStaff => ({
  id: '00000000-0000-4000-8000-000000000001',
  userId: 'user-1',
  teamId: '00000000-0000-4000-8000-000000000010',
  teamName: 'Ferrari',
  firstName: 'Charles',
  lastName: 'Leclerc',
  email: 'charles@ferrari.com',
  roleInTeam: 'Jefe de Mecánicos',
  phoneNumber: '+54 9 291 1234567',
  fileNumber: 'LEG-1234',
  isActive: true,
  deactivatedAt: null,
  version: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

export const buildCreateTeamStaffBody = (
  overrides?: Partial<CreateTeamStaffBody>,
): CreateTeamStaffBody => ({
  firstName: 'Charles',
  lastName: 'Leclerc',
  email: 'charles@ferrari.com',
  password: 'Password123!',
  teamId: '00000000-0000-4000-8000-000000000010',
  roleInTeam: 'Jefe de Mecánicos',
  phoneNumber: '+54 9 291 1234567',
  fileNumber: 'LEG-1234',
  ...overrides,
})

export const buildCreatedStaffRecord = (
  input: CreateTeamStaffRecord,
  email: string,
  count: number,
): TeamStaff => {
  const now = new Date().toISOString()
  return {
    ...input,
    id: input.id ?? `00000000-0000-4000-8000-${String(count + 1).padStart(12, '0')}`,
    teamName: 'Escudería',
    email,
    isActive: true,
    deactivatedAt: null,
    version: 1,
    createdAt: now,
    updatedAt: now,
  }
}
