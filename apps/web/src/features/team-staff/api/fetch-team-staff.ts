import { API_PATHS, type TeamStaff, teamStaffListSchema } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const TEAM_STAFF_QUERY_KEY = ['team-staff'] as const

export const fetchTeamStaff = (): Promise<readonly TeamStaff[]> =>
  apiRequest({ path: API_PATHS.teamStaff, schema: teamStaffListSchema })
