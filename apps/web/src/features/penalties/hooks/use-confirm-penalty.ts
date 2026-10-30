import type { Penalty } from '@fia/shared/contracts'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { confirmPenalty } from '../api/confirm-penalty'
import { PENALTIES_QUERY_KEY } from '../api/fetch-penalties'

export const useConfirmPenalty = (): UseMutationResult<Penalty, Error, string> => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => confirmPenalty(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PENALTIES_QUERY_KEY }),
  })
}
