import type { Driver } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchTeamDrivers, TEAM_DRIVERS_QUERY_KEY } from '../api/fetch-team-drivers'

export const useTeamDrivers = (): UseQueryResult<readonly Driver[], Error> =>
  useQuery({
    queryKey: TEAM_DRIVERS_QUERY_KEY,
    queryFn: fetchTeamDrivers,
  })
