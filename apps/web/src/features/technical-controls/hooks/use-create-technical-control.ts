import type { CreateTechnicalControlBody, TechnicalControl } from '@fia/shared/contracts'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { createTechnicalControl } from '../api/create-technical-control'
import { TECHNICAL_CONTROLS_QUERY_KEY } from '../api/fetch-technical-controls'

export const useCreateTechnicalControl = (): UseMutationResult<
  TechnicalControl,
  Error,
  CreateTechnicalControlBody
> => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTechnicalControl,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: TECHNICAL_CONTROLS_QUERY_KEY })
    },
  })
}
