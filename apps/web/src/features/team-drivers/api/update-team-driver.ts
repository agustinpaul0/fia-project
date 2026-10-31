import {
  type Driver,
  driverSchema,
  teamDriverPath,
  type UpdateTeamDriverBody,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export type UpdateTeamDriverVariables = {
  readonly id: string
  readonly body: UpdateTeamDriverBody
}

export const updateTeamDriver = ({ id, body }: UpdateTeamDriverVariables): Promise<Driver> =>
  apiRequest({
    path: teamDriverPath(id),
    method: 'PUT',
    body,
    schema: driverSchema,
  })
