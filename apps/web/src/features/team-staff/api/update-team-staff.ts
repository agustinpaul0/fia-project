import {
  type TeamStaff,
  teamStaffPath,
  teamStaffSchema,
  type UpdateTeamStaffBody,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const updateTeamStaff = ({
  id,
  body,
}: {
  readonly id: string
  readonly body: UpdateTeamStaffBody
}): Promise<TeamStaff> =>
  apiRequest({
    path: teamStaffPath(id),
    method: 'PUT',
    body,
    schema: teamStaffSchema,
  })
