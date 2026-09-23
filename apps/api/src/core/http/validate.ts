import { AppError, type FieldErrors } from '@fia/shared/domain'
import { zValidator } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import { type ZodType, z } from 'zod'

export const FORM_ERRORS_KEY = '_form'

const toFieldErrors = (error: z.core.$ZodError): FieldErrors => {
  const { formErrors, fieldErrors } = z.flattenError(error)
  const fields: Record<string, readonly string[]> = { ...fieldErrors }
  return formErrors.length > 0 ? { ...fields, [FORM_ERRORS_KEY]: formErrors } : fields
}

export const validate = <Target extends keyof ValidationTargets, Schema extends ZodType>(
  target: Target,
  schema: Schema,
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new AppError('VALIDATION_FAILED', toFieldErrors(result.error))
    }
  })
