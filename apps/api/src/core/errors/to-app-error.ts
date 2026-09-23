import { AppError, type ErrorCode, isAppError } from '@fia/shared/domain'
import { HTTPException } from 'hono/http-exception'

const HTTP_STATUS_TO_CODE: Readonly<Record<number, ErrorCode>> = {
  400: 'VALIDATION_FAILED',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'ROUTE_NOT_FOUND',
  413: 'PAYLOAD_TOO_LARGE',
  429: 'RATE_LIMITED',
}

export const toAppError = (error: unknown): AppError | null => {
  if (isAppError(error)) {
    return error
  }
  if (error instanceof HTTPException) {
    const code = HTTP_STATUS_TO_CODE[error.status]
    return code === undefined ? null : new AppError(code)
  }
  return null
}
