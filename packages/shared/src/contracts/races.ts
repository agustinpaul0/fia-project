import { z } from 'zod'
import { RACE_TYPES } from '../domain/scoring'
import { versionSchema } from './common'

export const raceTypeSchema = z.enum(RACE_TYPES)
export const raceStatusSchema = z.enum(['scheduled', 'modified', 'cancelled'])

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

export const updateRaceBodySchema = z.strictObject({
  name: z
    .string('El nombre es obligatorio.')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),
  date: z.iso.datetime({ message: 'Ingresá una fecha y hora válidas.', offset: true }),
  type: raceTypeSchema,
  circuitId: z.uuid('Elegí un circuito válido.'),
  version: versionSchema,
})

export const circuitOptionSchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  country: z.string(),
})

export const circuitOptionListSchema = z.array(circuitOptionSchema).readonly()

export const cancelRaceBodySchema = z.strictObject({
  version: versionSchema,
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
  status: raceStatusSchema.optional(),
  updatedByUserId: z.string().nullable().optional(),
  resultsRevision: z.int().nonnegative(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type RaceStatus = z.infer<typeof raceStatusSchema>
export type Race = z.infer<typeof raceSchema>
export type CreateRaceBody = z.infer<typeof createRaceBodySchema>
export type UpdateRaceBody = z.infer<typeof updateRaceBodySchema>
export type CancelRaceBody = z.infer<typeof cancelRaceBodySchema>
export type CircuitOption = z.infer<typeof circuitOptionSchema>
