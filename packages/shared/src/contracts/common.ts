import { z } from 'zod'
import { es } from 'zod/locales'
import { ERROR_CODES } from '../domain/errors'

export const configureSpanishValidation = (): void => {
  z.config(es())
}

export const idParamsSchema = z.strictObject({ id: z.uuid('El identificador no es válido.') })

export const versionSchema = z
  .int('La versión debe ser un número entero.')
  .positive('La versión debe ser mayor que cero.')

export const versionQuerySchema = z.strictObject({ version: z.coerce.number().pipe(versionSchema) })

export const errorResponseSchema = z.strictObject({
  error: z.strictObject({
    code: z.enum(ERROR_CODES),
    message: z.string().min(1),
    fields: z.record(z.string(), z.array(z.string()).readonly()).readonly().nullable(),
  }),
})

export type IdParams = z.infer<typeof idParamsSchema>
export type VersionQuery = z.infer<typeof versionQuerySchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
