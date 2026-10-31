import { type Driver, driverListSchema, PUBLIC_DRIVERS_PATH } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const PUBLIC_DRIVERS_QUERY_KEY = ['team-drivers', 'public'] as const

export const fetchPublicDrivers = (): Promise<readonly Driver[]> =>
  apiRequest({ path: PUBLIC_DRIVERS_PATH, schema: driverListSchema })
