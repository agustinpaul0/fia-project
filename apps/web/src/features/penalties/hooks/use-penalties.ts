import type { PenaltiesQuery, Penalty } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { fetchPenalties, PENALTIES_QUERY_KEY } from '../api/fetch-penalties'

export const usePenalties = (filter?: PenaltiesQuery): UseQueryResult<readonly Penalty[], Error> =>
  useQuery({
    queryKey: [...PENALTIES_QUERY_KEY, filter],
    queryFn: () => fetchPenalties(filter),
  })
