import { ERROR_CATALOG, isAppError } from '@fia/shared/domain'

export const toUserMessage = (error: unknown): string =>
  isAppError(error) ? error.message : ERROR_CATALOG.INTERNAL_ERROR.message
