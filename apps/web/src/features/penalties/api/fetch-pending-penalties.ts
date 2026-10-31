import { PENDING_PENALTIES_PATH, type Penalty, penaltyListSchema } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'
import { PENALTIES_QUERY_KEY } from './fetch-penalties'

export const PENDING_PENALTIES_QUERY_KEY = [...PENALTIES_QUERY_KEY, 'pending'] as const

export const fetchPendingPenalties = (): Promise<readonly Penalty[]> =>
  apiRequest({ path: PENDING_PENALTIES_PATH, schema: penaltyListSchema })
