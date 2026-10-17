import type { TeamRaceOption } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchTeamRaces } from '../api/fetch-team-races'

export const useTeamRaces = (
  teamId: string,
  season: number,
): UseQueryResult<readonly TeamRaceOption[]> =>
  useQuery({
    queryKey: ['teams', teamId, 'races', season],
    queryFn: () => fetchTeamRaces(teamId, season),
    enabled: teamId !== '',
  })
