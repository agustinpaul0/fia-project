import {
  API_PATHS,
  type CreateTeamDriverBody,
  type Driver,
  driverSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const createTeamDriver = (body: CreateTeamDriverBody): Promise<Driver> =>
  apiRequest({
    path: API_PATHS.teamDrivers,
    method: 'POST',
    body,
    schema: driverSchema,
  })
