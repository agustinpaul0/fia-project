import { AppError, type ErrorCode } from '@fia/shared/domain'

export type ConstraintErrorMap = Readonly<Record<string, ErrorCode>>

const findConstraintName = (error: unknown): string | null => {
  if (typeof error !== 'object' || error === null) {
    return null
  }
  if ('constraint' in error && typeof error.constraint === 'string') {
    return error.constraint
  }
  return 'cause' in error ? findConstraintName(error.cause) : null
}

export const translateConstraintViolations = async <T>(
  constraintErrors: ConstraintErrorMap,
  operation: () => Promise<T>,
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    const constraint = findConstraintName(error)
    const code = constraint === null ? undefined : constraintErrors[constraint]
    if (code === undefined) {
      throw error
    }
    throw new AppError(code)
  }
}
