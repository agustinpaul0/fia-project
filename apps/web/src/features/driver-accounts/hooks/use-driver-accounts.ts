import type {
  CreateDriverAccountBody,
  DriverAccount,
  UpdateDriverAccountBody,
} from '@fia/shared/contracts'
import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  type AccountVersion,
  createDriverAccount,
  DRIVER_ACCOUNTS_QUERY_KEY,
  deactivateDriverAccount,
  fetchDriverAccounts,
  fetchMyDriverAccount,
  MY_DRIVER_ACCOUNT_QUERY_KEY,
  updateDriverAccount,
} from '../api/driver-accounts-api'

type UpdateVars = { readonly id: string; readonly body: UpdateDriverAccountBody }

export const useDriverAccounts = (): UseQueryResult<readonly DriverAccount[]> =>
  useQuery({ queryKey: DRIVER_ACCOUNTS_QUERY_KEY, queryFn: fetchDriverAccounts })

export const useMyDriverAccount = (): UseQueryResult<DriverAccount> =>
  useQuery({ queryKey: MY_DRIVER_ACCOUNT_QUERY_KEY, queryFn: fetchMyDriverAccount })

const useInvalidate = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: DRIVER_ACCOUNTS_QUERY_KEY })
}

export const useCreateDriverAccount = (): UseMutationResult<
  DriverAccount,
  Error,
  CreateDriverAccountBody
> => useMutation({ mutationFn: createDriverAccount, onSuccess: useInvalidate() })

export const useUpdateDriverAccount = (): UseMutationResult<DriverAccount, Error, UpdateVars> =>
  useMutation({ mutationFn: updateDriverAccount, onSuccess: useInvalidate() })

export const useDeactivateDriverAccount = (): UseMutationResult<
  DriverAccount,
  Error,
  AccountVersion
> => useMutation({ mutationFn: deactivateDriverAccount, onSuccess: useInvalidate() })
