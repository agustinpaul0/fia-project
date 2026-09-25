import type { TeamStaff, UpdateTeamStaffBody } from '@fia/shared/contracts'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { TEAM_STAFF_QUERY_KEY } from '../api/fetch-team-staff'
import { updateTeamStaff } from '../api/update-team-staff'

export const useUpdateTeamStaff = (): UseMutationResult<
  TeamStaff,
  Error,
  { readonly id: string; readonly body: UpdateTeamStaffBody }
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTeamStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAM_STAFF_QUERY_KEY }),
  })
}
