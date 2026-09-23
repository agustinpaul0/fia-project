import { ERROR_CATALOG, type ErrorCode, type ErrorStatus } from './error-catalog'

export type FieldErrors = Readonly<Record<string, readonly string[]>>

export class AppError extends Error {
  readonly code: ErrorCode
  readonly status: ErrorStatus
  readonly fields: FieldErrors | null

  constructor(code: ErrorCode, fields: FieldErrors | null = null) {
    super(ERROR_CATALOG[code].message)
    this.name = 'AppError'
    this.code = code
    this.status = ERROR_CATALOG[code].status
    this.fields = fields
  }
}

export const isAppError = (value: unknown): value is AppError => value instanceof AppError
