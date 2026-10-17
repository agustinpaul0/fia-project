import type { DriverRow } from '@fia/shared/db'

export const aDriverRow = (overrides: Partial<DriverRow> = {}): DriverRow => ({
  id: '00000000-0000-4000-8000-000000000020',
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  teamId: '00000000-0000-4000-8000-000000000010',
  categoryId: null,
  role: 'main',
  version: 1,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides,
})
