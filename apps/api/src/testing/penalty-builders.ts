import type { Penalty } from '@fia/shared/contracts'

export const PENALTY_TEAM_ID = '00000000-0000-4000-8000-000000000010'
export const PENALTY_DRIVER_ID = '00000000-0000-4000-8000-000000000020'

export const aPenalty = (overrides: Partial<Penalty> = {}): Penalty => ({
  id: '00000000-0000-4000-8000-000000000001',
  teamId: PENALTY_TEAM_ID,
  teamName: 'Ferrari',
  categoryCode: 'F1',
  driverId: PENALTY_DRIVER_ID,
  driverName: 'Charles Leclerc',
  raceId: null,
  raceName: null,
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción reiterada de límites de pista.',
  issuedAt: '2026-05-24T14:30:00.000Z',
  confirmedAt: null,
  confirmedByUserId: null,
  notificationStatus: 'pending',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
  ...overrides,
})
