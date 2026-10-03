import { type ErrorCode, isAppError } from '@fia/shared/domain'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

const FIELD_BY_CODE: Partial<Record<ErrorCode, string>> = {
  USER_ALREADY_EXISTS: 'email',
  STAFF_FILE_NUMBER_ALREADY_EXISTS: 'fileNumber',
}

export type ServerFormError = {
  readonly message: string
  readonly fields: Readonly<Record<string, string>>
}

export const toServerFormError = (error: unknown, fallback: string): ServerFormError => {
  if (!isAppError(error)) {
    return { message: error instanceof Error ? error.message : fallback, fields: {} }
  }
  const fields: Record<string, string> = {}
  for (const [name, messages] of Object.entries(error.fields ?? {})) {
    const [first] = messages
    if (first !== undefined) {
      fields[name] = first
    }
  }
  const byCode = FIELD_BY_CODE[error.code]
  if (byCode !== undefined) {
    fields[byCode] = error.message
  }
  return { message: error.message, fields }
}

type ApplyInput<T extends FieldValues> = {
  readonly error: unknown
  readonly fallback: string
  readonly names: readonly Path<T>[]
}

export const applyServerErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  { error, fallback, names }: ApplyInput<T>,
): string | null => {
  const parsed = toServerFormError(error, fallback)
  let marked = false
  for (const name of names) {
    const message = parsed.fields[name]
    if (message !== undefined) {
      setError(name, { type: 'server', message })
      marked = true
    }
  }
  return marked ? null : parsed.message
}
