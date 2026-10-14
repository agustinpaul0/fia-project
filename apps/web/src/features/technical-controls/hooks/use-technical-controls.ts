import type { TechnicalControl, TechnicalControlsQuery } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  fetchTechnicalControls,
  TECHNICAL_CONTROLS_QUERY_KEY,
} from '../api/fetch-technical-controls'

export const useTechnicalControls = (
  filter?: TechnicalControlsQuery,
): UseQueryResult<readonly TechnicalControl[], Error> =>
  useQuery({
    queryKey: [...TECHNICAL_CONTROLS_QUERY_KEY, filter],
    queryFn: () => fetchTechnicalControls(filter),
  })
