import { isAppError } from '@fia/shared/domain'
import { MutationCache, QueryClient } from '@tanstack/react-query'
import { notifyError } from './notify-error'

const MAX_NETWORK_RETRIES = 2

export const shouldRetry = (failureCount: number, error: unknown): boolean =>
  isAppError(error) && error.code === 'NETWORK_ERROR' && failureCount < MAX_NETWORK_RETRIES

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: { queries: { retry: shouldRetry, staleTime: 30_000 } },
    mutationCache: new MutationCache({ onError: notifyError }),
  })
