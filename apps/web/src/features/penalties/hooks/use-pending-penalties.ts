import type { Penalty } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchPendingPenalties, PENDING_PENALTIES_QUERY_KEY } from '../api/fetch-pending-penalties'
import { PENALTIES_POLL_INTERVAL_MS } from './use-penalties'

export const usePendingPenalties = (enabled = true): UseQueryResult<readonly Penalty[]> =>
  useQuery({
    queryKey: PENDING_PENALTIES_QUERY_KEY,
    queryFn: fetchPendingPenalties,
    refetchInterval: PENALTIES_POLL_INTERVAL_MS,
    enabled,
  })
