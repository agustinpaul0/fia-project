import type { Driver } from '@fia/shared/contracts'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { TEAM_DRIVERS_QUERY_KEY } from '../api/fetch-team-drivers'
import { type UpdateTeamDriverVariables, updateTeamDriver } from '../api/update-team-driver'

export const useUpdateTeamDriver = (): UseMutationResult<
  Driver,
  Error,
  UpdateTeamDriverVariables
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTeamDriver,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAM_DRIVERS_QUERY_KEY }),
  })
}
