import type { Driver } from '@fia/shared/contracts'

export const aDriver = (overrides: Partial<Driver> = {}): Driver => ({
  id: '00000000-0000-4000-8000-000000000001',
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  teamId: '00000000-0000-4000-8000-000000000002',
  role: 'main',
  version: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})
