import { API_PATHS, type TeamOption, teamOptionListSchema } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const TEAMS_QUERY_KEY = ['teams'] as const

export const fetchTeamOptions = (): Promise<readonly TeamOption[]> =>
  apiRequest({ path: API_PATHS.teams, schema: teamOptionListSchema })
