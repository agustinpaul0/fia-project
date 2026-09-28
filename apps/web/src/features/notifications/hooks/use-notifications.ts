import type { ScoreNotification } from '@fia/shared/contracts'
import { isAppError } from '@fia/shared/domain'
import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  confirmNotification,
  fetchMyNotifications,
  fetchNotificationsAudit,
  NOTIFICATIONS_AUDIT_QUERY_KEY,
  NOTIFICATIONS_QUERY_KEY,
  NOTIFICATIONS_REFRESH_MS,
} from '../api/notifications-api'

export const CONFIRMED_MESSAGE = 'Listo: quedó registrado que tu escudería recibió el puntaje.'

export const useMyNotifications = (enabled = true): UseQueryResult<readonly ScoreNotification[]> =>
  useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchMyNotifications,
    refetchInterval: NOTIFICATIONS_REFRESH_MS,
    enabled,
  })

export const useNotificationsAudit = (): UseQueryResult<readonly ScoreNotification[]> =>
  useQuery({ queryKey: NOTIFICATIONS_AUDIT_QUERY_KEY, queryFn: fetchNotificationsAudit })

export const useConfirmNotification = (): UseMutationResult<ScoreNotification, Error, string> => {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
  return useMutation({
    mutationFn: confirmNotification,
    onSuccess: async () => {
      toast.success(CONFIRMED_MESSAGE)
      await refresh()
    },
    onError: async (error) => {
      if (isAppError(error) && error.status === 409) {
        await refresh()
      }
    },
  })
}
