import type { TeamOption } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchTeamOptions, TEAMS_QUERY_KEY } from '../api/fetch-team-options'

export const useTeamOptions = (): UseQueryResult<readonly TeamOption[]> =>
  useQuery({ queryKey: TEAMS_QUERY_KEY, queryFn: fetchTeamOptions })
