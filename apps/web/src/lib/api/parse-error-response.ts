import { errorResponseSchema } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'

export const parseErrorResponse = (payload: unknown): AppError => {
  const parsed = errorResponseSchema.safeParse(payload)
  if (!parsed.success) {
    return new AppError('INTERNAL_ERROR')
  }
  return new AppError(parsed.data.error.code, parsed.data.error.fields)
}
