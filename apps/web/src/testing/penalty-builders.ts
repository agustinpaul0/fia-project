import type { Penalty } from '@fia/shared/contracts'

export const aPenalty = (overrides: Partial<Penalty> = {}): Penalty => ({
  id: '00000000-0000-4000-8000-000000000001',
  teamId: '00000000-0000-4000-8000-000000000010',
  teamName: 'Ferrari',
  driverId: '00000000-0000-4000-8000-000000000020',
  driverName: 'Charles Leclerc',
  raceId: null,
  raceName: null,
  type: 'time_penalty',
  penalty: '5 segundos',
  reason: 'Límites de pista.',
  issuedAt: '2026-05-24T14:30:00.000Z',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
  ...overrides,
})
