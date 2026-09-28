import type { TeamStaff } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchTeamStaff, TEAM_STAFF_QUERY_KEY } from '../api/fetch-team-staff'

export const useTeamStaff = (): UseQueryResult<readonly TeamStaff[]> =>
  useQuery({ queryKey: TEAM_STAFF_QUERY_KEY, queryFn: fetchTeamStaff })
