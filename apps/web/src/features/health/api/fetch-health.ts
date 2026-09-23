import { API_PATHS, type HealthResponse, healthResponseSchema } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const HEALTH_QUERY_KEY = ['health'] as const

export const fetchHealth = (): Promise<HealthResponse> =>
  apiRequest({ path: API_PATHS.health, schema: healthResponseSchema })
