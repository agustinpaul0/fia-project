import {
  API_PATHS,
  MY_TECHNICAL_CONTROLS_PATH,
  type TechnicalControl,
  type TechnicalControlsQuery,
  technicalControlListSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const TECHNICAL_CONTROLS_QUERY_KEY = ['technical-controls'] as const

const toQueryString = (filter?: TechnicalControlsQuery): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filter ?? {})) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const fetchTechnicalControls = (
  filter?: TechnicalControlsQuery,
  onlyMine = false,
): Promise<readonly TechnicalControl[]> => {
  const basePath = onlyMine ? MY_TECHNICAL_CONTROLS_PATH : API_PATHS.technicalControls
  return apiRequest({
    path: `${basePath}${toQueryString(filter)}`,
    schema: technicalControlListSchema,
  })
}
