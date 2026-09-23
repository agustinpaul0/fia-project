import { z } from 'zod'
import { versionSchema } from './common'

export const seasonYearSchema = z
  .number()
  .int('El año debe ser un número entero.')
  .min(1950, 'El año debe ser mayor o igual a 1950.')
  .max(2100, 'El año debe ser menor o igual a 2100.')

export const createSeasonBodySchema = z.strictObject({
  year: seasonYearSchema,
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(60),
})

export const seasonSchema = z.strictObject({
  id: z.uuid(),
  year: seasonYearSchema,
  name: z.string(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Season = z.infer<typeof seasonSchema>
export type CreateSeasonBody = z.infer<typeof createSeasonBodySchema>
