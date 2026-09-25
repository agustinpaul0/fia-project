import type { TeamStaff } from '@fia/shared/contracts'

export const aTeamStaffMember = (overrides: Partial<TeamStaff> = {}): TeamStaff => ({
  id: '00000000-0000-4000-8000-000000000001',
  userId: 'usr-1',
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
