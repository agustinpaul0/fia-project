import type { TechnicalControl } from '@fia/shared/contracts'

export const aTechnicalControl = (overrides: Partial<TechnicalControl> = {}): TechnicalControl => ({
  id: '00000000-0000-4000-8000-000000000001',
  teamId: '00000000-0000-4000-8000-000000000010',
  teamName: 'McLaren',
  driverId: null,
  driverName: null,
  carNumber: 4,
  raceId: null,
  raceName: null,
  controlType: 'fuel',
  status: 'rejected',
  notes: null,
  inspectedAt: '2026-05-24T14:30:00.000Z',
  expiresAt: '2026-05-31T14:30:00.000Z',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
  ...overrides,
})
