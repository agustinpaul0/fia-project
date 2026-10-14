import {
  API_PATHS,
  type CreatePenaltyBody,
  type Penalty,
  penaltySchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const createPenalty = (body: CreatePenaltyBody): Promise<Penalty> =>
  apiRequest({
    path: API_PATHS.penalties,
    method: 'POST',
    body,
    schema: penaltySchema,
  })
