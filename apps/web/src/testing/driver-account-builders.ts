import type { DriverAccount } from '@fia/shared/contracts'
import { aDriver } from './driver-builders'
import { jsonResponse } from './mock-fetch'

export const aDriverAccount = (overrides: Partial<DriverAccount> = {}): DriverAccount => ({
  id: '00000000-0000-4000-9000-000000000001',
  userId: 'user-1',
  driverId: '00000000-0000-4000-8000-000000000001',
  driverName: 'Charles Leclerc',
  driverCode: 'LEC',
  teamName: 'Ferrari',
  name: 'Charles Leclerc',
  email: 'leclerc@ferrari.com',
  role: 'driver',
  isOfficial: true,
  isActive: true,
  deactivatedAt: null,
  version: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

export const SAINZ = aDriver({
  id: '00000000-0000-4000-8000-000000000055',
  firstName: 'Carlos',
  lastName: 'Sainz',
  code: 'SAI',
})

export const publicDriversResponse = (): Response =>
  jsonResponse([aDriver(), SAINZ].map((d) => ({ ...d, teamName: null, hasOfficialAccount: false })))
