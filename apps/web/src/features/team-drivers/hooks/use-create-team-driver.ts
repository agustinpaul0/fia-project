import type { CreateTeamDriverBody, Driver } from '@fia/shared/contracts'
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { createTeamDriver } from '../api/create-team-driver'
import { TEAM_DRIVERS_QUERY_KEY } from '../api/fetch-team-drivers'

export const useCreateTeamDriver = (): UseMutationResult<Driver, Error, CreateTeamDriverBody> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeamDriver,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAM_DRIVERS_QUERY_KEY }),
  })
}
