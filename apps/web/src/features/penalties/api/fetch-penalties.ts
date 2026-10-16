import {
  API_PATHS,
  type PenaltiesQuery,
  type Penalty,
  penaltyListSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const PENALTIES_QUERY_KEY = ['penalties'] as const

const toQueryString = (filter?: PenaltiesQuery): string => {
  if (!filter) {
    return ''
  }
  const params = new URLSearchParams()
  if (filter.season) {
    params.set('season', String(filter.season))
  }
  if (filter.teamId) {
    params.set('teamId', filter.teamId)
  }
  if (filter.type) {
    params.set('type', filter.type)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const fetchPenalties = (filter?: PenaltiesQuery): Promise<readonly Penalty[]> =>
  apiRequest({
    path: `${API_PATHS.penalties}${toQueryString(filter)}`,
    schema: penaltyListSchema,
  })
