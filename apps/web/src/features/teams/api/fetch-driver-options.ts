import {
  type DriverOption,
  driverOptionListSchema,
  teamDriverOptionsPath,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const fetchDriverOptions = (teamId: string): Promise<readonly DriverOption[]> =>
  apiRequest({ path: teamDriverOptionsPath(teamId), schema: driverOptionListSchema })
