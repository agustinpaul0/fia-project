import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateTeamStaff } from '../api/deactivate-team-staff'
import { TEAM_STAFF_QUERY_KEY } from '../api/fetch-team-staff'

export const useDeactivateTeamStaff = (): UseMutationResult<
  null,
  Error,
  { readonly id: string; readonly version: number }
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateTeamStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAM_STAFF_QUERY_KEY }),
  })
}
