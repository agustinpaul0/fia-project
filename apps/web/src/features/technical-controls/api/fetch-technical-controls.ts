import {
  API_PATHS,
  type TechnicalControl,
  type TechnicalControlsQuery,
  technicalControlListSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const TECHNICAL_CONTROLS_QUERY_KEY = ['technical-controls'] as const

const toQueryString = (filter?: TechnicalControlsQuery): string => {
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
  if (filter.controlType) {
    params.set('controlType', filter.controlType)
  }
  if (filter.status) {
    params.set('status', filter.status)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const fetchTechnicalControls = (
  filter?: TechnicalControlsQuery,
): Promise<readonly TechnicalControl[]> =>
  apiRequest({
    path: `${API_PATHS.technicalControls}${toQueryString(filter)}`,
    schema: technicalControlListSchema,
  })
