import { AppError } from '@fia/shared/domain'
import type { ErrorHandler } from 'hono'
import type { Logger } from '../logger'
import { toErrorBody } from './error-body'
import { toAppError } from './to-app-error'

export const createErrorHandler =
  (logger: Logger): ErrorHandler =>
  (error, c) => {
    const known = toAppError(error)
    if (known !== null) {
      return c.json(toErrorBody(known), { status: known.status })
    }
    logger.error('Error no controlado', { path: c.req.path, method: c.req.method, error })
    const internal = new AppError('INTERNAL_ERROR')
    return c.json(toErrorBody(internal), { status: internal.status })
  }
