import {
  API_PATHS,
  type PenaltiesQuery,
  type Penalty,
  penaltyListSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const PENALTIES_QUERY_KEY = ['penalties'] as const

const toQueryString = (filter?: PenaltiesQuery): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filter ?? {})) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const fetchPenalties = (filter?: PenaltiesQuery): Promise<readonly Penalty[]> =>
  apiRequest({
    path: `${API_PATHS.penalties}${toQueryString(filter)}`,
    schema: penaltyListSchema,
  })
