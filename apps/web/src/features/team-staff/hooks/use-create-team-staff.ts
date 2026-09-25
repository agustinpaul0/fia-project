import type { CreateTeamStaffBody, TeamStaff } from '@fia/shared/contracts'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeamStaff } from '../api/create-team-staff'
import { TEAM_STAFF_QUERY_KEY } from '../api/fetch-team-staff'

export const useCreateTeamStaff = (): UseMutationResult<TeamStaff, Error, CreateTeamStaffBody> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeamStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAM_STAFF_QUERY_KEY }),
  })
}
