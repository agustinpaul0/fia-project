import {
  API_PATHS,
  type CreateTeamStaffBody,
  type TeamStaff,
  teamStaffSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const createTeamStaff = (body: CreateTeamStaffBody): Promise<TeamStaff> =>
  apiRequest({
    path: API_PATHS.teamStaff,
    method: 'POST',
    body,
    schema: teamStaffSchema,
  })
