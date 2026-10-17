import type { CreatePenaltyBody, Penalty } from '@fia/shared/contracts'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { createPenalty } from '../api/create-penalty'
import { PENALTIES_QUERY_KEY } from '../api/fetch-penalties'

export const useCreatePenalty = (): UseMutationResult<Penalty, Error, CreatePenaltyBody> => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createPenalty,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PENALTIES_QUERY_KEY })
    },
  })
}
