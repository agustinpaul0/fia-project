import type { ErrorResponse } from '@fia/shared/contracts'
import type { AppError } from '@fia/shared/domain'

export const toErrorBody = (error: AppError): ErrorResponse => ({
  error: { code: error.code, message: error.message, fields: error.fields },
})
