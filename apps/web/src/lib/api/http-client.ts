import { AppError } from '@fia/shared/domain'
import type { z } from 'zod'
import { parseErrorResponse } from './parse-error-response'
import { type RequestSpec, readJson, sendRequest } from './send-request'

export type ApiRequest<Schema extends z.ZodType> = RequestSpec & { readonly schema: Schema }

export const apiRequest = async <Schema extends z.ZodType>(
  request: ApiRequest<Schema>,
): Promise<z.output<Schema>> => {
  const response = await sendRequest(request)
  const payload = await readJson(response)
  if (!response.ok) {
    throw parseErrorResponse(payload)
  }
  const parsed = request.schema.safeParse(payload)
  if (!parsed.success) {
    throw new AppError('INTERNAL_ERROR')
  }
  return parsed.data
}
