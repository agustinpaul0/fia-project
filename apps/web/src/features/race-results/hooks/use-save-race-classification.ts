import type { RaceClassification } from '@fia/shared/contracts'
import { isAppError } from '@fia/shared/domain'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { RACES_QUERY_KEY, raceQueryKeys } from '../api/race-query-keys'
import { type SaveClassificationInput, saveRaceClassification } from '../api/race-results-api'

export const CLASSIFICATION_SAVED_MESSAGE =
  'Resultado guardado. Ya es visible para escuderías y público.'

export const useSaveRaceClassification = (): UseMutationResult<
  RaceClassification,
  Error,
  SaveClassificationInput
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveRaceClassification,
    onSuccess: async (saved) => {
      queryClient.setQueryData(raceQueryKeys.classification(saved.race.id), saved)
      toast.success(CLASSIFICATION_SAVED_MESSAGE)
      await queryClient.invalidateQueries({ queryKey: RACES_QUERY_KEY })
    },
    onError: async (error, { raceId }) => {
      if (isAppError(error) && error.code === 'STALE_VERSION') {
        await queryClient.invalidateQueries({ queryKey: raceQueryKeys.classification(raceId) })
      }
    },
  })
}
