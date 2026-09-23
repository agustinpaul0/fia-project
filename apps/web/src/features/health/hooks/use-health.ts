import type { HealthResponse } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchHealth, HEALTH_QUERY_KEY } from '../api/fetch-health'

export const useHealth = (): UseQueryResult<HealthResponse> =>
  useQuery({ queryKey: HEALTH_QUERY_KEY, queryFn: fetchHealth })
