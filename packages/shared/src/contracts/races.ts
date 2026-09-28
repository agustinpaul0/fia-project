import { z } from 'zod'
import { versionSchema } from './common'
import { raceTypeSchema } from './race-classification'

export const raceRoundSchema = z
  .number()
  .int('La ronda debe ser un número entero.')
  .min(1, 'La ronda debe ser mayor o igual a 1.')

export const createRaceBodySchema = z.strictObject({
  seasonId: z.uuid('El identificador de temporada debe ser un UUID válido.'),
  categoryId: z.uuid('El identificador de categoría debe ser un UUID válido.'),
  circuitId: z.uuid('El identificador de circuito debe ser un UUID válido.'),
  round: raceRoundSchema,
  type: raceTypeSchema.default('grand_prix'),
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(100),
  date: z.iso.datetime(),
})

export const raceSchema = z.strictObject({
  id: z.uuid(),
  seasonId: z.uuid(),
  categoryId: z.uuid(),
  circuitId: z.uuid(),
  round: raceRoundSchema,
  type: raceTypeSchema,
  name: z.string(),
  date: z.iso.datetime(),
  resultsRevision: z.int().nonnegative(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Race = z.infer<typeof raceSchema>
export type CreateRaceBody = z.infer<typeof createRaceBodySchema>
