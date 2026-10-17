import type { DriverOption } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchDriverOptions } from '../api/fetch-driver-options'

export const useDriverOptions = (teamId: string): UseQueryResult<readonly DriverOption[]> =>
  useQuery({
    queryKey: ['teams', teamId, 'drivers'],
    queryFn: () => fetchDriverOptions(teamId),
    enabled: teamId !== '',
  })
