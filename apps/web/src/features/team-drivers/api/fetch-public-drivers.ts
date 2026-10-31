import {
  PUBLIC_DRIVERS_PATH,
  type PublicDriver,
  publicDriverListSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const PUBLIC_DRIVERS_QUERY_KEY = ['team-drivers', 'public'] as const

export const fetchPublicDrivers = (): Promise<readonly PublicDriver[]> =>
  apiRequest({ path: PUBLIC_DRIVERS_PATH, schema: publicDriverListSchema })
