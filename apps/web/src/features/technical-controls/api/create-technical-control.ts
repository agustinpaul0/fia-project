import {
  API_PATHS,
  type CreateTechnicalControlBody,
  type TechnicalControl,
  technicalControlSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const createTechnicalControl = (
  body: CreateTechnicalControlBody,
): Promise<TechnicalControl> =>
  apiRequest({
    path: API_PATHS.technicalControls,
    method: 'POST',
    body,
    schema: technicalControlSchema,
  })
