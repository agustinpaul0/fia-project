import { API_PATHS, type Driver, driverListSchema } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const TEAM_DRIVERS_QUERY_KEY = ['team-drivers'] as const

export const fetchTeamDrivers = (): Promise<readonly Driver[]> =>
  apiRequest({ path: API_PATHS.teamDrivers, schema: driverListSchema })
