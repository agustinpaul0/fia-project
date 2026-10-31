import type { Driver } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchPublicDrivers, PUBLIC_DRIVERS_QUERY_KEY } from '../api/fetch-public-drivers'

export const usePublicDrivers = (): UseQueryResult<readonly Driver[], Error> =>
  useQuery({ queryKey: PUBLIC_DRIVERS_QUERY_KEY, queryFn: fetchPublicDrivers })
