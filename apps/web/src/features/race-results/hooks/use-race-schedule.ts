import type {
  CancelRaceBody,
  CircuitOption,
  RaceSummary,
  UpdateRaceBody,
} from '@fia/shared/contracts'
import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { RACES_QUERY_KEY } from '../api/race-query-keys'
import { cancelScheduledRace, fetchCircuits, updateScheduledRace } from '../api/race-results-api'

type UpdateVars = { readonly raceId: string; readonly body: UpdateRaceBody }
type CancelVars = { readonly raceId: string; readonly body: CancelRaceBody }

export const useCircuits = (): UseQueryResult<readonly CircuitOption[]> =>
  useQuery({ queryKey: [...RACES_QUERY_KEY, 'circuits'], queryFn: fetchCircuits })

const useRefreshRaces = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: RACES_QUERY_KEY })
}

export const useUpdateRace = (): UseMutationResult<RaceSummary, Error, UpdateVars> =>
  useMutation({
    mutationFn: ({ raceId, body }) => updateScheduledRace(raceId, body),
    onSuccess: useRefreshRaces(),
  })

export const useCancelRace = (): UseMutationResult<RaceSummary, Error, CancelVars> =>
  useMutation({
    mutationFn: ({ raceId, body }) => cancelScheduledRace(raceId, body),
    onSuccess: useRefreshRaces(),
  })
