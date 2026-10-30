import { confirmPenaltyPath, type Penalty, penaltySchema } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const confirmPenalty = (id: string): Promise<Penalty> =>
  apiRequest({
    path: confirmPenaltyPath(id),
    method: 'POST',
    schema: penaltySchema,
  })
