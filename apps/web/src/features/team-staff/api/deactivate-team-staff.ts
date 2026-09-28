import { teamStaffPath } from '@fia/shared/contracts'
import { z } from 'zod'
import { apiRequest } from '@/lib/api/http-client'

export const deactivateTeamStaff = ({
  id,
  version,
}: {
  readonly id: string
  readonly version: number
}): Promise<null> =>
  apiRequest({
    path: `${teamStaffPath(id)}?version=${version}`,
    method: 'DELETE',
    schema: z.null(),
  })
